'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  function verifyLogin(e: React.FormEvent) {
    e.preventDefault()
    
    if (user === "admin" && password === "admin") {
      
      document.cookie = `usuario=${user}; path=/;`
      document.cookie = `senha=${password}; path=/;`
      
      router.push("/dashboard")
      return
    }

    toast.error("Login ou senha incorretos!")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Digite seu usuário abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="login">Login:</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Digite seu usuário"
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha:</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Digite sua senha"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
