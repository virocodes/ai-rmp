import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="font-bold text-3xl">Login</div>
            <SignIn />
        </div>
    )
}