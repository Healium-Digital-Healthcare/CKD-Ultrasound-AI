"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { ClipboardCopy } from "lucide-react"
import QRCode from "qrcode"

const supabase = createClient()

type FactorType = "totp" | "phone"

export function TwoFactorSetup() {
  const [factors, setFactors] = useState<any[]>([])
  const [selectedFactor, setSelectedFactor] = useState<FactorType>("totp")

  const [factorId, setFactorId] = useState<string | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)

  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [phone, setPhone] = useState("")

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)


  // Load enrolled factors
  const loadFactors = async () => {
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (error) {
      toast.error("Failed to load MFA factors")
      return
    }
    setFactors(data.all)
  }

  useEffect(() => {
    loadFactors()
  }, [])

  useEffect(() => {
    if (qrUrl) {
        QRCode.toDataURL(qrUrl)
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error(err))
    }
  }, [qrUrl])

  // Start enrolling a factor
  const handleEnroll = async () => {
    setLoading(true)
    try {
      // TOTP enroll
      if (selectedFactor === "totp") {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
        })
        if (error) throw error

        setFactorId(data.id)
        setQrUrl(data.totp.uri)       // use URI to build QR
        setSecret(data.totp.secret)   // base32 secret

        // Create a challenge for TOTP
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: data.id })
        if (challengeError) throw challengeError 
        
        setChallengeId(challengeData.id)

        toast.success("Scan QR with Authenticator app and verify code")
      }

      // Phone enroll
      else if (selectedFactor === "phone") {
        if (!phone) {
          toast.error("Please enter a phone number")
          setLoading(false)
          return
        }

        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: "phone",
          phone,
        })
        if (enrollError) throw enrollError

        setFactorId(enrollData.id)

        const { data: challengeData, error: challengeError } =
          await supabase.auth.mfa.challenge({
            factorId: enrollData.id,
          })
        if (challengeError) throw challengeError

        toast.success("Verification code sent to phone")
        setChallengeId(challengeData.id)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to enroll factor")
    } finally {
      setLoading(false)
    }
  }

  // Create challenge (required before verify)
  const createChallenge = async (fId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: fId,
      })
      if (error) throw error
      setChallengeId(data.id)
    } catch (err: any) {
      toast.error(err.message || "Failed to create challenge")
    } finally {
      setLoading(false)
    }
  }

  // Verify factor
  const handleVerify = async () => {
    if (!factorId || !challengeId) {
      toast.error("Missing verification state")
      return
    }
    if (!code) {
      toast.error("Enter the code")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      })
      if (error) throw error

      toast.success("Two-factor enabled successfully!")
      resetEnrollment()
      loadFactors()
    } catch (err: any) {
      toast.error(err.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const resetEnrollment = () => {
    setFactorId(null)
    setChallengeId(null)
    setQrUrl(null)
    setSecret(null)
    setPhone("")
    setCode("")
  }

  // Unenroll / disable factor
  const handleUnenroll = async (id: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id })

      if (error) throw error

      toast.success("MFA factor removed")
      loadFactors()
    } catch (err: any) {
      toast.error(err.message || "Failed to disable factor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>

      {/* 1️⃣ Select Factor Type */}
      <div className="flex gap-2">
        <Button
          variant={selectedFactor === "totp" ? "default" : "outline"}
          onClick={() => {
            resetEnrollment();
            setSelectedFactor("totp");
          }}
        >
          Authenticator App (TOTP)
        </Button>
        <Button
          variant={selectedFactor === "phone" ? "default" : "outline"}
          onClick={() => {
            resetEnrollment();
            setSelectedFactor("phone");
          }}
        >
          Phone (SMS/WhatsApp)
        </Button>
      </div>

      {/* 2️⃣ Enrollment UI */}
      {!factorId && (
        <>
          {selectedFactor === "totp" && (
            <Button onClick={handleEnroll} disabled={loading}>
              {loading ? "Starting..." : "Enable Authenticator App"}
            </Button>
          )}
          {selectedFactor === "phone" && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button onClick={handleEnroll} disabled={loading}>
                {loading ? "Sending..." : "Enable Phone MFA"}
              </Button>
            </div>
          )}
        </>
      )}

      {/* 3️⃣ Show QR / Secret for TOTP */}
      {qrUrl && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Scan QR with authenticator or enter secret manually:
          </p>
          <div className="flex gap-2 items-center">
            <Input value={secret || ""} readOnly />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(secret || "")
                toast.success("Secret copied")
              }}
            >
              <ClipboardCopy size={16} />
            </Button>
          </div>
          {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="Authenticator QR Code" />}

          {/* <img src={qrUrl} alt="Authenticator QR Code" className="w-40 h-40" /> */}
        </div>
      )}

      {/* 4️⃣ Verification Input */}
      {(challengeId || qrUrl) && (
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleVerify} disabled={loading}>
            Verify
          </Button>
        </div>
      )}

      {/* 5️⃣ List Enrolled Factors */}
      {factors.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">Active MFA Factors:</p>

          {factors.map((f: any) => (
            <div
                key={f.id}
                className="flex justify-between items-center border p-2 rounded"
            >
                <span>
                {f.factor_type ? f.factor_type.toUpperCase() : "UNKNOWN"}
                {f.type === "phone" && f.phone ? ` (${f.phone})` : ""}
                </span>
                <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUnenroll(f.id)}
                >
                Disable
                </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}