import { useState } from 'react';
import { APP_NAME } from '../config';
import Link from 'next/link';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  NavLink,
} from 'reactstrap';

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar {...args} expand="md">
       <Link href="/" passHref legacyBehavior>
          <NavLink className='font-weight-bold'>{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <Link href="/components" passHref legacyBehavior>
                <NavLink>Components</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/signup" passHref legacyBehavior>
                <NavLink>Sign up</NavLink>
              </Link>
            </NavItem>
              <NavItem>
              <Link href="/signin" passHref legacyBehavior>
                <NavLink>Signin</NavLink>
              </Link>
            </NavItem>
            <NavItem></NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>Simple Text</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
