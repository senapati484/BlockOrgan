import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: "pending" | "verified" | "rejected" | "in_progress" }) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="text-success border-success">
          Verified
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="text-warning border-warning">
          Pending
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="text-primary border-primary">
          In Progress
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="text-destructive border-destructive">
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}
