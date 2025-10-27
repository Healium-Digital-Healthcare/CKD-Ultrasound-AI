
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useUser } from "@/lib/contexts/UserContext";

export function LandingNav() {

  const { user } = useUser();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button className="text-sm font-medium bg-[#009A6B] hover:bg-[#00b87d] text-white transition-all duration-200 shadow-lg shadow-[#009A6B]/20 hover:shadow-[#009A6B]/40 flex items-center gap-2">
            <User className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth/login">
        <Button className="text-sm font-medium bg-[#009A6B] hover:bg-[#00b87d] text-white transition-all duration-200 shadow-lg shadow-[#009A6B]/20 hover:shadow-[#009A6B]/40">
          Sign In
        </Button>
      </Link>
    </div>
  )
}