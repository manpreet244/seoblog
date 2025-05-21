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
  const [user, setUser] = useState(null); // 🔑 This is the fix

  const toggle = () => setIsOpen(!isOpen);

  // ✅ Check auth only in browser
  useEffect(() => {
    setUser(isAuth()); // Set user only in client
    isAuth() && Router.push("/"); // Redirect if user is authenticated
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
            <NavItem>
              <Link href="/components" passHref legacyBehavior>
                <NavLink>Components</NavLink>
              </Link>
            </NavItem>

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
