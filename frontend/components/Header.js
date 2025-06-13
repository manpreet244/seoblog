import { useState, useEffect } from "react";
import { APP_NAME } from "../config";
import Link from "next/link";
import Router from "next/router";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  NavLink,
} from "reactstrap";
import { signout, isAuth } from "../actions/auth";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); 

  const toggle = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    setUser(isAuth()); 
  
  }, []);

  return (
    <div>
      <Navbar {...args} expand="md">
        <Link href="/" passHref legacyBehavior>
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
        
            {!user && (
              <>
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
              </>
            )}
          
            {user && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user" passHref legacyBehavior>
                <NavLink
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                
                >
                  {`${user.name}'s Dashboard`}
                </NavLink>
                </Link>
              </NavItem>
            )}
             {user && isAuth().role === 1 &&(
              <NavItem>
                <Link href="/admin" passHref legacyBehavior>
                <NavLink
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                
                >
                  {`${user.name}'s Dashboard`}
                </NavLink>
                </Link>
              </NavItem>
            )}
            <NavItem>
              <Link href="/blogs" passHref legacyBehavior>
              <NavLink className="nav-link">Blogs</NavLink>
              </Link>
            </NavItem>
            {user && (
              <NavItem>
                <NavLink
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    signout(() => {
                      setUser(null);
                      Router.push("/");
                    });
                  }}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}

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
