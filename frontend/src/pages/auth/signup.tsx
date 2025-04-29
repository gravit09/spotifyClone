import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border-zinc-800",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "bg-zinc-800 text-white hover:bg-zinc-700",
            formButtonPrimary: "bg-green-600 hover:bg-green-700",
            footerActionLink: "text-green-600 hover:text-green-700",
          },
        }}
      />
    </div>
  );
};

export default Signup;
