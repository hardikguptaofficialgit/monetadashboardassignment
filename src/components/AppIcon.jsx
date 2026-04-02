const AppIcon = ({
  icon: Icon,
  size = 18,
  color = "currentColor",
  stroke = "currentColor",
  fill = "none",
  opacity = 1,
  className = "",
}) => {
  // skip rendering when no icon component is provided
  if (!Icon) return null;

  return (
    <span className={`app-icon ${className}`.trim()} style={{ width: size, height: size, color, opacity }}>
      <Icon width={size} height={size} stroke={stroke} fill={fill} style={{ display: "block" }} />
    </span>
  );
};

export default AppIcon;
