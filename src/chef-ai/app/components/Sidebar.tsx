import React from "react";
import "./sidebar.css";
import Image from "next/image";

interface SidebarProps {
  items: { label: string; icon?: React.ReactNode; onClick: () => void }[];
}

const imageClick = () =>{
    //useRouter for navigation!!!
    console.log("Going home!")
    //router.push('homepage')!!!!
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header"><Image src="/images/house-icon-2.png" priority onClick={imageClick} style={{cursor: 'pointer'}} alt="logo" width={50} height={50} /> <span>Chef-AId </span></div>
      <nav className="sidebar-nav">
        {items.map((item, idx) => (
          <button key={idx} className="sidebar-item" onClick={item.onClick}>
            {item.icon && <span className="sidebar-icon">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;