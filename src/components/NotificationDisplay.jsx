import { IoNotificationsSharp } from "react-icons/io5";
import { Badge } from "primereact/badge";

export default function NotificationDisplay() {
  return (
    <i className="p-overlay-badge">
      <IoNotificationsSharp />
      <Badge value={2} severity={"danger"}></Badge>
    </i>
  );
}
