import {
  ArrowRight,
  Bath,
  Bookmark,
  Building2,
  Calendar,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Ghost,
  Heart,
  House,
  List,
  Lock,
  Luggage,
  Map,
  MapPin,
  Minus,
  PawPrint,
  Plus,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  Sparkles,
  Star,
  TreePalm,
  TreePine,
  UserRound,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react-native";

import { isString } from "@/lib/utils";
import { colors } from "@/theme";

// The app's only icon set. Screens pick icons by name from here, never from lucide directly.
const icons = {
  home: House,
  search: Search,
  heart: Heart,
  calendar: Calendar,
  user: UserRound,
  settings: Settings,
  pin: MapPin,
  filters: SlidersHorizontal,
  share: Share,
  bookmark: Bookmark,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
  lock: Lock,
  eye: Eye,
  eyeOff: EyeOff,
  list: List,
  map: Map,
  minus: Minus,
  plus: Plus,
  close: X,
  success: CircleCheck,
  error: CircleAlert,
  star: Star,
  card: CreditCard,
  trips: Luggage,
  policyChat: Ghost,
  document: FileText,
  cabins: TreePine,
  beach: Waves,
  city: Building2,
  villas: TreePalm,
  hotTub: Bath,
  pets: PawPrint,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  /** Fills the glyph (active tab, selected category, rating star). Defaults to the stroke color. */
  filled?: boolean | string;
  strokeWidth?: number;
};

export const Icon = ({ name, size = 24, color = colors.ink, filled, strokeWidth = 2 }: IconProps) => {
  const Glyph = icons[name];
  const fill = isString(filled) ? filled : filled ? color : "none";

  return <Glyph size={size} color={color} fill={fill} strokeWidth={strokeWidth} />;
};
