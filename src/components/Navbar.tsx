import { FC, ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  badge?: string;
}

interface NavbarProps {
  appName: string;
  avatarSrc: string;
  dropdownItems: DropdownItem[];
  indicatorContent?: ReactNode;
  indicatorBadge?: string;
  userName?: string; 
  role?: string;
}

const Navbar: FC<NavbarProps> = ({ appName, avatarSrc, dropdownItems, indicatorContent, indicatorBadge, userName, role }) => {
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{appName}</a>
      </div>
      <div className="flex-none">
        {indicatorContent && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                {indicatorContent}
                {indicatorBadge && <span className="badge badge-sm indicator-item">{indicatorBadge}</span>}
              </div>
            </div>
            <div tabIndex={0} className="dropdown-content bg-base-100 z-10 mt-3 w-52 shadow rounded-box">
              <div className="p-4">
                <h3 className="font-bold">Dropdown Content</h3>
                <p>Custom content goes here...</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="flex items-center space-x-3 p-2 cursor-pointer">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={avatarSrc} />
            </div>
            <div className="flex flex-col text-left">
              {userName && <span className="text-m font-semibold text-black">{userName}</span>}
              {role && <span className="text-xs text-gray-500">{role}</span>}
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {dropdownItems.map((item, index) => (
              <li key={index}>
                <a onClick={item.onClick} className="text-lg">
                  {item.label}
                  {item.badge && <span className="badge">{item.badge}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
