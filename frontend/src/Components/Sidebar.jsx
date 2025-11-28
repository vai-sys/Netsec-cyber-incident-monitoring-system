


// import React from 'react'; 
// import { Home, User, AlertTriangle, FileText, Map, Clock, BarChart2, PlusCircle } from 'lucide-react'; 
// import { Link } from 'react-router-dom';  

// const Sidebar = () => {   
//   const menuItems = [     
//     { icon: <Home className="w-6 h-6" />, text: 'Dashboard', path: '/dashboard' },     
//     { icon: <User className="w-6 h-6" />, text: 'Profile', path: '/profile' },     
//     { icon: <AlertTriangle className="w-6 h-6" />, text: 'Incidents', path: '/incidents' },     
       
//     { icon: <BarChart2 className="w-6 h-6" />, text: 'Sector Analysis', path: '/sector' }   
//   ];    

//   return (     
//     <div className="fixed top-0 left-0 h-full w-64 bg-black text-white shadow-xl">       
             
//       <nav className="mt-12 space-y-4">         
//         {menuItems.map((item, index) => (           
//           <Link             
//             key={index}             
//             to={item.path}             
//             className="flex items-center p-4 hover:bg-green-900 rounded-lg transition-colors duration-300"           
//           >             
//             {item.icon}             
//             <span className="ml-4 text-sm font-medium">{item.text}</span>           
//           </Link>         
//         ))}       
//       </nav>     
//     </div>   
//   ); 
// };  

// export default Sidebar;





import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  User,
  AlertTriangle,
  FileText,
  Map,
  Clock,
  BarChart2,
  PlusCircle
} from 'lucide-react';

const menuItems = [
  { icon: <Home className="w-5 h-5" />, text: 'Dashboard', path: '/dashboard' },
  { icon: <User className="w-5 h-5" />, text: 'Profile', path: '/profile' },
  { icon: <AlertTriangle className="w-5 h-5" />, text: 'Incidents', path: '/incidents' },
  { icon: <FileText className="w-5 h-5" />, text: 'Reports', path: '/reports' },
  { icon: <PlusCircle className="w-5 h-5" />, text: 'Register Incident', path: '/reports/create' },
  // { icon: <Clock className="w-5 h-5" />, text: 'Timeline', path: '/timeline' },
  { icon: <BarChart2 className="w-5 h-5" />, text: 'Sector Analysis', path: '/sector' },
  // optional:
  // { icon: <Map className="w-5 h-5" />, text: 'Map', path: '/map' },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-black text-white shadow-xl z-40">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="text-xl font-extrabold">NetSec</div>
        <div className="text-xs text-slate-400 mt-1">Monitoring</div>
      </div>

      <nav className="mt-6 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive ? 'bg-green-900 text-white shadow-inner' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }
            >
              <div className="opacity-90">{item.icon}</div>
              <span className="truncate">{item.text}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-6 w-full px-6">
        <div className="text-xs text-slate-500">Signed in as</div>
        <div className="mt-2 text-sm text-slate-200">User</div>
      </div>
    </aside>
  );
}
