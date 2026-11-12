import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert, FormField } from "@/components/auth/FormField";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type Field = "fullName" | "email" | "password" | "confirmPassword";
type Errors = Partial<Record<Field, string>>;

// Mirrors the backend RegisterRequest rules.
const passwordRules = [
  { label: "8–72 characters", test: (p: string) => p.length >= 8 && p.length <= 72 },
  { label: "At least one letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /\d/.test(p) },
];

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  const name = values.fullName.trim();
  if (!name) errors.fullName = "Full name is required";
  else if (name.length < 2 || name.length > 100) errors.fullName = "Full name must be between 2 and 100 characters";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email address";
  if (!values.password) errors.password = "Password is required";
  else if (!passwordRules.every((r) => r.test(values.password))) errors.password = "Password doesn't meet the requirements below";
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match";
  return errors;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<Field, string>>({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await register({ fullName: values.fullName.trim(), email: values.email.trim(), password: values.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) setErrors({ email: err.message });
        else setErrors(err.fieldErrorMap);
        setFormError(err.status === 409 || err.message === "Validation failed" ? null : err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start learning offensive and defensive security today.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <FormAlert message={formError} />}
        <FormField
          id="fullName"
          label="Full name"
          autoComplete="name"
          placeholder="Arvind Kumar"
          value={values.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
          autoFocus
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set("email")}
          error={errors.email}
        />
        <div className="space-y-2">
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={set("password")}
            error={errors.password}
          />
          <ul className="grid gap-1 pt-1" aria-label="Password requirements">
            {passwordRules.map((rule) => {
              const ok = rule.test(values.password);
              return (
                <li key={rule.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-primary" : "text-muted-foreground")}>
                  <Check className={cn("h-3.5 w-3.5", !ok && "opacity-30")} />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
        />
        <Button type="submit" className="h-11 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
