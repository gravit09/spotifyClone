import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;

      try {
        syncAttempted.current = true;
        console.log("[AuthCallback] Syncing user:", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        if (!user.id || !user.imageUrl) {
          throw new Error("Missing required user data");
        }

        const response = await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        console.log("[AuthCallback] Sync response:", response.data);

        if (response.data.success) {
          console.log(
            "[AuthCallback] User synced successfully:",
            response.data.user
          );
          toast.success("Successfully signed in!");
          navigate("/");
        } else {
          throw new Error(response.data.error || "Failed to sync user data");
        }
      } catch (error: any) {
        console.error("[AuthCallback] Error:", error);
        setError(error.message || "Failed to sync user data");
        toast.error("Failed to sign in. Please try again.");
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          {error ? (
            <>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-emerald-500 hover:underline"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <Loader className="size-6 text-emerald-500 animate-spin" />
              <h3 className="text-zinc-400 text-xl font-bold">
                Logging you in
              </h3>
              <p className="text-zinc-400 text-sm">Redirecting...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default AuthCallbackPage;
