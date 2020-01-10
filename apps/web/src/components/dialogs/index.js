import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Flex, Box, Text, Button as RebassButton } from "rebass";
import { Input, Checkbox, Label } from "@rebass/forms";
import * as Icon from "react-feather";
import { ThemeProvider } from "../../utils/theme";
import Modal from "react-modal";

const Dialog = props => {
  const [open, setOpen] = useState(false);
  Dialog.close = () => setOpen(false);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);
  return (
    <ThemeProvider>
      {theme => (
        <Modal
          isOpen={open}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              borderWidth: 0,
              borderRadius: theme.radii["default"],
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              boxShadow: theme.shadows["3"],
              width: "20%",
              paddingRight: 40,
              paddingLeft: 40,
              overflowY: "hidden"
            },
            overlay: {
              background: theme.colors.overlay
            }
          }}
        >
          <Flex flexDirection="column">
            <Flex
              flexDirection="row"
              alignItems="center"
              alignSelf="center"
              justifyContent="center"
              color="primary"
              py={2}
            >
              <Box height={42}>
                <props.icon size={42} />
              </Box>
              <Text
                mx={2}
                as="span"
                variant="title"
                fontSize={28}
                textAlign="center"
              >
                {props.title}
              </Text>
            </Flex>
            {props.content}
            <Flex
              flexDirection="row"
              my={1}
              justifyContent="center"
              alignItems="center"
            >
              <RebassButton
                variant="primary"
                mx={1}
                width={"25%"}
                onClick={props.positiveButton.click}
              >
                {props.positiveButton.text || "OK"}
              </RebassButton>
              <RebassButton
                variant="secondary"
                width={"25%"}
                onClick={props.negativeButton.click}
              >
                {props.negativeButton.text || "Cancel"}
              </RebassButton>
            </Flex>
          </Flex>
        </Modal>
      )}
    </ThemeProvider>
  );
};

const inputRefs = [];
export const CreateNotebookDialog = props => {
  const [topics, setTopics] = useState([""]);
  const addTopic = index => {
    topics.splice(index + 1, 0, "");
    setTopics([...topics]);
    setTimeout(() => {
      inputRefs[index + 1].focus();
    }, 0);
  };
  return (
    <Dialog
      open={props.open}
      title="Notebook"
      icon={Icon.BookOpen}
      content={
        <Box my={1}>
          <Input
            variant="default"
            onChange={e => (CreateNotebookDialog.title = e.target.value)}
            placeholder="Enter name"
          />
          <Input
            variant="default"
            sx={{ marginTop: 1 }}
            onChange={e => (CreateNotebookDialog.description = e.target.value)}
            placeholder="Enter description (optional)"
          />
          <Label alignItems="center" my={1}>
            <Checkbox variant="checkbox" />
            Locked?
          </Label>
          <Text variant="body" fontWeight="bold" my={1}>
            Topics (optional):
          </Text>
          <Box sx={{ maxHeight: 44 * 5, overflowY: "auto", marginBottom: 1 }}>
            {topics.map((value, index) => (
              <Flex
                key={index.toString()}
                flexDirection="row"
                sx={{ marginBottom: 1 }}
              >
                <Input
                  ref={ref => (inputRefs[index] = ref)}
                  variant="default"
                  value={topics[index]}
                  placeholder="Topic name"
                  onFocus={e => {
                    CreateNotebookDialog.lastLength =
                      e.nativeEvent.target.value.length;
                  }}
                  onChange={e => {
                    topics[index] = e.target.value;
                    setTopics([...topics]);
                  }}
                  onKeyUp={e => {
                    if (e.nativeEvent.key === "Enter") {
                      addTopic(index);
                    } else if (
                      e.nativeEvent.key === "Backspace" &&
                      CreateNotebookDialog.lastLength === 0 &&
                      index > 0
                    ) {
                      topics.splice(index, 1);
                      setTopics([...topics]);
                      setTimeout(() => {
                        inputRefs[index - 1].focus();
                      }, 0);
                    }
                    CreateNotebookDialog.lastLength =
                      e.nativeEvent.target.value.length;
                  }}
                />
                <RebassButton
                  variant="tertiary"
                  sx={{ marginLeft: 1 }}
                  px={2}
                  py={1}
                  onClick={() => addTopic(index)}
                >
                  <Box height={20}>
                    <Icon.Plus size={20} />
                  </Box>
                </RebassButton>
              </Flex>
            ))}
          </Box>
        </Box>
      }
      positiveButton={{
        text: "Done",
        click: () =>
          props.onDone(
            topics,
            CreateNotebookDialog.title,
            CreateNotebookDialog.description
          )
      }}
      negativeButton={{ text: "Cancel", click: props.close }}
    />
  );
};

const ConfirmationDialog = props => (
  <Dialog
    open={true}
    title={props.title}
    icon={props.icon}
    content={
      <Box my={1}>
        <Text>{props.message}</Text>
      </Box>
    }
    positiveButton={{
      text: "Yes",
      click: props.onYes
    }}
    negativeButton={{ text: "No", click: props.onNo }}
  />
);

export const ask = (icon, title, message) => {
  const root = document.getElementById("dialogContainer");
  const perform = (result, resolve) => {
    Dialog.close();
    ReactDOM.unmountComponentAtNode(root);
    resolve(result);
  };
  if (root) {
    return new Promise((resolve, _) => {
      ReactDOM.render(
        <ConfirmationDialog
          id="confirmationDialog"
          title={title}
          message={message}
          icon={icon}
          onNo={() => perform(false, resolve)}
          onYes={() => perform(true, resolve)}
        />,
        root
      );
    });
  }
  console.log("Notebooks");
  return Promise.reject("No element with id 'dialogContainer'");
};
