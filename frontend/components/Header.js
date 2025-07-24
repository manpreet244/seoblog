import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    setMounted(true);
    setAuth(isAuth());
  }, []);

  const handleSignout = () => {
    signout(() => {
      setAuth(null);
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
                Blog App
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
              className="d-flex align-items-center flex-column gap-2 flex-md-row"
            >
              {mounted && !auth && (
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
                    <Link href="/admin/signin" passHref legacyBehavior>
                      <NavLink
                        style={{
                          fontWeight: "500",
                          color: "#312a33",
                          textDecoration: "none",
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        Admin sign in
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

              {mounted && auth?.role === 0 && (
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
                      {`${auth.name}'s Dashboard`}
                    </NavLink>
                  </Link>
                </NavItem>
              )}

              {mounted && auth?.role === 1 && (
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
                      {`${auth.name}'s Dashboard`}
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

              {mounted && auth && (
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
