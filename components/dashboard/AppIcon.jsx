import * as LucideIcons from 'lucide-react';

function AppIcon({ icon,  className }) {
  const IconComponent = LucideIcons[icon];

  if (!IconComponent) {
    return null; // Or render a placeholder/error icon
  }

  return <IconComponent className={className} />;
}

export default AppIcon;
