import { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";
import style from "./style.module.css";
import React from "react";

export function TextArea({
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={style.textArea} {...rest}>
      {" "}
    </textarea>
  );
}
