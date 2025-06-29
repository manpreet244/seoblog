import { useState, useEffect } from "react";
import { APP_NAME } from "../config";
import Link from "next/link";
import Router from "next/router";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Container,
  NavbarToggler,
  Collapse,
} from "reactstrap";
import { signout, isAuth } from "../actions/auth";
import Search from "./blog/Search";

function Header() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(isAuth());
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const handleSignout = () => {
    signout(() => {
      setUser(null);
      Router.push("/");
      setIsOpen(false);
    });
  };

  return (
    <>
      <Navbar
        expand="md"
        light
        style={{
          background: "linear-gradient(to right, #fdfbff, #f0f0f5)",
          paddingTop: "0.6rem",
          paddingBottom: "0.6rem",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center justify-content-between px-4"
        >
          {/* Left: Brand */}
          <div className="d-flex align-items-center">
            <Link href="/" passHref legacyBehavior>
              <NavLink
                style={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "#c634eb",
                  textDecoration: "none",
                }}
              >
                {APP_NAME}
              </NavLink>
            </Link>
          </div>

          <NavbarToggler onClick={toggle} className="d-md-none" />

          <Collapse
            isOpen={isOpen}
            navbar
            className="d-md-flex justify-content-end align-items-center"
          >
            <Nav
              navbar
              className="d-flex align-items-center flex-column gap-2  flex-md-row"
            >
              {!user && (
                <>
                  <NavItem>
                    <Link href="/signup" passHref legacyBehavior>
                      <NavLink
                        style={{
                          fontWeight: "500",
                          color: "#312a33",
                          textDecoration: "none",
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </NavLink>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/signin" passHref legacyBehavior>
                      <NavLink
                        style={{
                          fontWeight: "500",
                          color: "#312a33",
                          textDecoration: "none",
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Sign in
                      </NavLink>
                    </Link>
                  </NavItem>
                </>
              )}

              {user?.role === 0 && (
                <NavItem>
                  <Link href="/user" passHref legacyBehavior>
                    <NavLink
                      style={{
                        fontWeight: "500",
                        color: "#312a33",
                        textDecoration: "none",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {`${user.name}'s Dashboard`}
                    </NavLink>
                  </Link>
                </NavItem>
              )}

              {user?.role === 1 && (
                <NavItem>
                  <Link href="/admin" passHref legacyBehavior>
                    <NavLink
                      style={{
                        fontWeight: "500",
                        color: "#312a33",
                        textDecoration: "none",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {`${user.name}'s Dashboard`}
                    </NavLink>
                  </Link>
                </NavItem>
              )}

              <NavItem>
                <Link href="/user/crud/create" passHref legacyBehavior>
                  <NavLink
                    style={{
                      backgroundColor: "#c634eb",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontWeight: "500",
                      textDecoration: "none",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    Write a Blog
                  </NavLink>
                </Link>
              </NavItem>

              <NavItem>
                <Link href="/blogs" passHref legacyBehavior>
                  <NavLink
                    style={{
                      fontWeight: "500",
                      color: "#312a33",
                      textDecoration: "none",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    Blogs
                  </NavLink>
                </Link>
              </NavItem>

              {user && (
                <NavItem>
                  <NavLink
                    onClick={handleSignout}
                    style={{
                      fontWeight: "500",
                      color: "#312a33",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    Sign out
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      <Search />
    </>
  );
}

export default Header;
