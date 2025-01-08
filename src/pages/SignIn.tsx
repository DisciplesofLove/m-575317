import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignIn = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/chat");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setError(null); // Clear any existing errors
        toast({
          description: "Successfully signed in!",
        });
        navigate("/chat");
      }

      // Handle various error cases
      if (event === 'SIGN_IN' && !session) {
        setError("Invalid login credentials. Please try again.");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                style: {
                  button: { background: 'rgb(147 51 234)', color: 'white' },
                  anchor: { color: 'rgb(147 51 234)' },
                }
              }}
              theme="dark"
              providers={[]}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
          alt="Code visualization"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-background/90 mix-blend-multiply" />
      </div>
    </div>
  );
};

export default SignIn;