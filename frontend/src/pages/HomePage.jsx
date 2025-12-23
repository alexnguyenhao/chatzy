import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to AppChat
        </h1>
        <p className="text-xl text-muted-foreground">
          Modern chat application with real-time messaging
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/login")}>Get Started</Button>
          <Button variant="outline" onClick={() => navigate("/about")}>
            Learn More
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Chat</CardTitle>
            <CardDescription>Instant messaging with Socket.IO</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with others in real-time with our modern chat system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secure & Private</CardTitle>
            <CardDescription>End-to-end encryption</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your conversations are protected with industry-standard
              encryption.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Easy to Use</CardTitle>
            <CardDescription>Intuitive interface</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Beautiful, modern UI built with React and Tailwind CSS.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
