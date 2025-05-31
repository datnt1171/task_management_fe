import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Inbox
} from "lucide-react"

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/forms", label: "Form Templates", icon: FileText },
  { href: "/dashboard/sent", label: "Sent Tasks", icon: Send },
  { href: "/dashboard/received", label: "Received Tasks", icon: Inbox },
]

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vn', name: 'Tiếng Việt', flag: '🇻🇳' }
]

export const externalApps = [
  { name: 'CRM System', url: 'https://crm.yourcompany.com', icon: '📊' },
  { name: 'HR Portal', url: 'https://hr.yourcompany.com', icon: '👥' },
  { name: 'Finance App', url: 'https://finance.yourcompany.com', icon: '💰' },
  { name: 'Reports', url: 'https://reports.yourcompany.com', icon: '📈' }
]