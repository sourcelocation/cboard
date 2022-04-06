// import { useLocalStorage } from '@mantine/hooks';
import React, { useState } from 'react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Button } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },
  linktext: {
    padding: '8px 12px',
    color: '#000'
  },
  linktextActive: {
    color: theme.colors[theme.primaryColor][9]
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));


export function Navbar() {
  const links = [
    { link: "/", label: "Home" },
    { link: "/about", label: "About" },
    { link: "/pricing", label: "Pricing" },
    { link: "/dashboard", label: "Dashboard" },
  ]
  const location = useLocation()
  const [opened, toggleOpened] = useBooleanToggle(false);
  // const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <a
      key={link.label}
      // href={link.link}
      className={cx(classes.link, { [classes.linkActive]: location.pathname === link.link })}
      onClick={(event) => {
        event.preventDefault();
        // setActive(link.link);
        toggleOpened(false);
      }}
    >
      <Link to={link.link} style={{ textDecoration: 'none' }}>
        <div className={cx(classes.linktext, { [classes.linktextActive]: location.pathname === link.link })}>
          {link.label}
        </div>
      </Link>
    </a>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={0} className={classes.root}>
      <Container className={classes.header}>
        <p style={{ color: '#1f1f1f', margin: '0' }}>cboard</p>
        {/* <MantineLogo /> */}
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Button radius="xl" sx={{ height: 30 }}>
          Get early access
        </Button>
      </Container>
    </Header>
  );
}