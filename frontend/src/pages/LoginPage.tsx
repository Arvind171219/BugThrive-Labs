import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert, FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

type Errors = Partial<Record<"email" | "password", string>>;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(email, password);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      // Students land on the dashboard (or the page they were sent away from).
      const target = from && from.pathname !== "/login" ? `${from.pathname}${from.search}` : "/dashboard";
      navigate(target, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrorMap);
        setFormError(err.message === "Validation failed" ? null : err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your training.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <FormAlert message={formError} />}
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoFocus
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to BugThrive Labs?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
