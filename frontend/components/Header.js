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
     <Navbar {...args} expand="md" className="shadow-sm py-2">

        <Link href="/" passHref legacyBehavior>
          <NavLink className="fw-bold me-3">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>

            {!user && (
              <>
                <NavItem className="me-3">
                  <Link href="/signup" passHref legacyBehavior>
                    <NavLink className="fw-bold">Sign up</NavLink>
                  </Link>
                </NavItem>
                <NavItem className="me-3">
                  <Link href="/signin" passHref legacyBehavior>
                    <NavLink className="fw-bold">Sign in</NavLink>
                  </Link>
                </NavItem>
              </>
            )}

            {user && isAuth().role === 0 && (
              <NavItem className="me-3">
                <Link href="/user" passHref legacyBehavior>
                  <NavLink className="fw-bold" style={{ cursor: "pointer" }}>
                    {`${user.name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {user && isAuth().role === 1 && (
              <NavItem className="me-3">
                <Link href="/admin" passHref legacyBehavior>
                  <NavLink className="fw-bold" style={{ cursor: "pointer" }}>
                    {`${user.name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            <NavItem className="me-3">
              <Link href="/blogs" passHref legacyBehavior>
                <NavLink className="fw-bold">Blogs</NavLink>
              </Link>
            </NavItem>

            {user && (
              <NavItem className="me-3">
                <NavLink
                  className="fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    signout(() => {
                      setUser(null);
                      Router.push("/");
                    });
                  }}
                >
                  Sign out
                </NavLink>
              </NavItem>
            )}

            <UncontrolledDropdown nav inNavbar className="me-3">
              <DropdownToggle nav caret className="fw-bold">
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
          <NavbarText className="fw-bold">Simple Text</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
