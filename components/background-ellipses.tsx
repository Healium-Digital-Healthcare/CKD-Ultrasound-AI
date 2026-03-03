export function BackgroundEllipses() {
  return (
    <>
      {/* Ellipse 5 - 914px × 453px at -281px, 584px */}
      <div
        style={{
          position: 'fixed',
          width: '914px',
          height: '453px',
          left: '-281px',
          top: '584px',
          background: 'rgba(42, 138, 195, 0.29)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Ellipse 2 - 828px × 318px at 766px, 424px */}
      <div
        style={{
          position: 'fixed',
          width: '828px',
          height: '318px',
          left: '766px',
          top: '424px',
          background: 'rgba(241, 120, 117, 0.47)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Ellipse 3 - 557px × 318px at 59px, 0px */}
      <div
        style={{
          position: 'fixed',
          width: '557px',
          height: '318px',
          left: '59px',
          top: '0px',
          background: 'rgba(241, 120, 117, 0.44)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Ellipse 6 - 192px × 244px at -107px, 142px */}
      <div
        style={{
          position: 'fixed',
          width: '192px',
          height: '244px',
          left: '-107px',
          top: '142px',
          background: 'rgba(42, 138, 195, 0.37)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </>
  )
}
