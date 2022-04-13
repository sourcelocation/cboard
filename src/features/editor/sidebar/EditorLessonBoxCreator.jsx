import { Chip, Chips, createStyles, Divider, Group } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  label: { width: '100%', textAlign: 'start', backgroundColor: `white !important` },
  checked: {
    backgroundColor: `${theme.colors.main[1]} !important`,
  }
}))

export function EditorLessonBoxCreator() {
  const { classes } = useStyles()
  return <Chips
    variant="filled"
    direction="column"
    grow={true}
    classNames={classes}
    size="xs"
    spacing={4}
  >
    <Chip value="react">
      Hello
      <div style={{backgroundColor: 'red', height: '100%'}}></div>
      
    </Chip>
    <Chip value="ng">Biology</Chip>
    <Chip value="svelte">Chemistry</Chip>
    <Chip value="vue">Geography</Chip>
  </Chips>
}