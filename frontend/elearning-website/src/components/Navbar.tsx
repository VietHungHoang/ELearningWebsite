import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          CodeCademy
        </Link>

        {/* Search Bar (Tạm thời để trống) */}
        <div className="relative w-1/3">
          <input
            type="text"
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm khóa học..."
          />
        </div>

        <NavigationMenu>
    <NavigationMenuList>
        <NavigationMenuItem>
        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
        <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
        </NavigationMenuContent>
        </NavigationMenuItem>
    </NavigationMenuList>
    </NavigationMenu>

        {/* Navigation Links & Buttons */}
        {/* <div className="flex items-center space-x-4">
          <Link to="/courses" className="text-gray-600 hover:text-blue-500">
            Khóa học
          </Link>
          <a href="#" className="text-gray-600 hover:text-blue-500">
            Giảng dạy
          </a>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
            Đăng nhập
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Đăng ký
          </button> */}
        {/* </div> */}
      </div>
    </nav>
  );
};

export default Navbar;