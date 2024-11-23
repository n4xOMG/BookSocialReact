import { Button } from "@mui/material";
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react";
import DeleteIcon from "@mui/icons-material/Delete";
import { css } from "@emotion/react";
import { Transforms } from "slate";
import clsx from "clsx";
export const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <span {...attributes}>
      {children}
      <span
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          alt="test"
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            page-break-after: always;
            box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
          `}
        />
        <Button
          active={selected && focused ? "true" : "false"}
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={clsx(css`
            display: ${selected && focused ? "inline" : "none"};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `)}
        >
          <DeleteIcon />
        </Button>
      </span>
    </span>
  );
};
