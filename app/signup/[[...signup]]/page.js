import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="font-bold text-3xl">Sign Up</div>
            <SignUp />
        </div>
    )
}