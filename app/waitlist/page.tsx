import WaitlistCard from "@/components/marketing/Waitlist"
import { buttonVariants } from "@/components/ui/button"
import { ArrowBigLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"

const page = () => {
  return (
    <div className="w-full h-svh flex flex-col items-center justify-center bg-navy relative">
      <Link href='/' className={buttonVariants({
        variant: 'ghost',
        className: 'absolute left-4 top-4 font-extralight text-gray-200 hover:bg-navy-light hover:text-white'
      })}>
          <ArrowLeft />
          Back Home
      </Link>
        <WaitlistCard />
    </div>
  )
}

export default page