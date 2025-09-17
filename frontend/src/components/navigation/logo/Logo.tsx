import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center mr-8">
      <img 
        src="/media/homepage/logo-default.svg" 
        alt="Lernen Logo" 
        className="w-30 h-30"
      />
    </Link>
  )
}

export default Logo
