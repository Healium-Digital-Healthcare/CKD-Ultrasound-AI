-- Create the function to trigger AI analysis and handle response
create or replace function trigger_ai_analysis(image_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  image_record record;
  api_response http_response;
  fastapi_url text;
  response_body json;
  result json;
begin
  -- Get the image details
  select id, image_path, case_id
  into image_record
  from case_images
  where id = image_id_param;

  if not found then
    return json_build_object(
      'success', false,
      'error', 'Image not found'
    );
  end if;

  -- Update status to processing
  update case_images
  set 
    analysis_status = 'processing',
    updated_at = now()
  where id = image_id_param;

  -- Build FastAPI URL
  fastapi_url := current_setting('app.settings.fastapi_url', true) || '/predict/' || image_id_param::text;

  -- Call FastAPI endpoint
  select * into api_response
  from http((
    'GET',
    fastapi_url,
    array[http_header('Content-Type', 'application/json')],
    null,
    null
  )::http_request);

  -- Parse response
  response_body := api_response.content::json;

  -- Handle successful response
  if api_response.status >= 200 and api_response.status < 300 and response_body->>'status' = 'success' then
    -- Update with analysis result
    update case_images
    set 
      analysis_status = 'completed',
      analysis_result = response_body->'analysis_result',
      updated_at = now()
    where id = image_id_param;

    result := json_build_object(
      'success', true,
      'message', 'Analysis completed successfully',
      'image_id', image_id_param
    );
  else
    -- Update status to failed
    update case_images
    set 
      analysis_status = 'failed',
      analysis_result = json_build_object(
        'error', coalesce(response_body->>'error', 'FastAPI call failed'),
        'status_code', api_response.status
      ),
      updated_at = now()
    where id = image_id_param;

    result := json_build_object(
      'success', false,
      'error', coalesce(response_body->>'error', 'Analysis failed'),
      'status_code', api_response.status
    );
  end if;

  return result;
exception
  when others then
    -- Handle any errors
    update case_images
    set 
      analysis_status = 'failed',
      analysis_result = json_build_object('error', SQLERRM),
      updated_at = now()
    where id = image_id_param;

    return json_build_object(
      'success', false,
      'error', SQLERRM
    );
end;
$$;

-- Grant permissions
grant execute on function trigger_ai_analysis(uuid) to authenticated;
grant execute on function trigger_ai_analysis(uuid) to anon;

-- Auto-trigger on insert
create or replace function auto_trigger_analysis()
returns trigger
language plpgsql
security definer
as $$
begin
  perform trigger_ai_analysis(new.id);
  return new;
end;
$$;

drop trigger if exists on_image_insert_trigger on case_images;
create trigger on_image_insert_trigger
  after insert on case_images
  for each row
  execute function auto_trigger_analysis();
