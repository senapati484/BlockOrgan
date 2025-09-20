"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react"

interface Txn {
  hash: string
  type: "registration" | "verification" | "match" | "update"
  from: string
  to: string
  time: string
  status: "success" | "failed" | "pending"
  value: string
}

const sample: Txn[] = [
  { hash: "0x1a2b...e9f0", type: "verification", from: "0xabc...1234", to: "0xdef...5678", time: "2m ago", status: "success", value: "0.004 ETH" },
  { hash: "0x9a8b...c7d6", type: "registration", from: "0xaaa...bbbb", to: "0x111...2222", time: "10m ago", status: "success", value: "0.002 ETH" },
  { hash: "0x7f6e...5d4c", type: "match", from: "0x333...4444", to: "0x555...6666", time: "1h ago", status: "pending", value: "0.006 ETH" },
  { hash: "0x4c3b...2a19", type: "update", from: "0x777...8888", to: "0x999...0000", time: "2h ago", status: "failed", value: "0.001 ETH" },
]

export default function AdminTransactionsPage() {
  const [filterType, setFilterType] = useState<string>("all")
  const [query, setQuery] = useState("")

  const filtered = sample.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || t.hash.toLowerCase().includes(q) || t.from.toLowerCase().includes(q) || t.to.toLowerCase().includes(q)
    return matchesType && matchesQuery
  })

  const statusBadge = (s: Txn["status"]) => {
    if (s === "success") return <Badge variant="outline" className="text-success border-success">Success</Badge>
    if (s === "pending") return <Badge variant="outline" className="text-warning border-warning">Pending</Badge>
    return <Badge variant="outline" className="text-destructive border-destructive">Failed</Badge>
  }

  const typeBadge = (t: Txn["type"]) => {
    const map: Record<Txn["type"], string> = {
      registration: "Registration",
      verification: "Verification",
      match: "Match",
      update: "Update",
    }
    return <Badge variant="secondary">{map[t]}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">Blockchain explorer-style view of LifeChain transactions</p>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2 flex gap-3">
                <Input placeholder="Search by hash, from, or to" value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button variant="outline" className="bg-transparent" onClick={() => setQuery("")}>Clear</Button>
              </div>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="match">Match</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Audit
                </Button>
              </div>
            </div>
            <Separator />
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Showing {filtered.length} of {sample.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableCaption className="text-left">Transparent, immutable records for trust and safety</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.hash}>
                      <TableCell className="font-mono text-xs">{t.hash}</TableCell>
                      <TableCell>{typeBadge(t.type)}</TableCell>
                      <TableCell className="font-mono text-xs">{t.from}</TableCell>
                      <TableCell className="font-mono text-xs">{t.to}</TableCell>
                      <TableCell>{t.value}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.time}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" className="bg-transparent" aria-label="Copy hash">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="bg-transparent" aria-label="View on chain">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <ShieldAlert className="h-6 w-6 mx-auto mb-2" />
                No transactions found for the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
