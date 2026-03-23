import { Phone, Mail, MapPin } from "lucide-react";

const UtilityBar = () => (
  <div className="bg-deep-navy text-deep-navy-foreground text-xs py-2">
    <div className="container-max px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-brass-gold" />
        <span>Serving Palm Beach &amp; Broward Counties</span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <a href="tel:5612478632" className="flex items-center gap-1.5 hover:text-brass-gold transition-colors">
          <Phone className="w-3 h-3" />
          <span>(561) 247-8632</span>
        </a>
        <a href="mailto:sales@waterfrontdirectmail.com" className="flex items-center gap-1.5 hover:text-brass-gold transition-colors">
          <Mail className="w-3 h-3" />
          <span>sales@waterfrontdirectmail.com</span>
        </a>
        <span className="text-brass-gold font-medium">Free Campaign Consultation</span>
      </div>
    </div>
  </div>
);

export default UtilityBar;
