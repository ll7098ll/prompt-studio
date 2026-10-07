"use client";
import { useState } from "react";
import { ko } from "date-fns/locale";
import type { Node } from "./model";
import { Button } from "./vendor/shadcn/button";
import { Input } from "./vendor/shadcn/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./vendor/shadcn/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./vendor/shadcn/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./vendor/shadcn/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./vendor/shadcn/table";
import { Calendar } from "./vendor/shadcn/calendar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./vendor/shadcn/sidebar";
export const SHADCN_COMPONENTS = [
  "button",
  "input",
  "tabs",
  "select",
  "dialog",
  "table",
  "calendar",
  "sidebar",
];
const str = (n: Node, k: string) => String(n.props[k] ?? "");
const lines = (n: Node, k = "items") => str(n, k).split("\n").filter(Boolean);
export default function ShadcnContent({ node }: { node: Node }) {
  const [active, setActive] = useState(""),
    [date, setDate] = useState<Date | undefined>(),
    [sort, setSort] = useState<{ index: number; reverse: boolean } | null>(
      null,
    );
  const s = (k: string) => str(node, k);
  let content;
  switch (node.component) {
    case "button": {
      const href = s("href");
      const valid = /^(https:\/\/|#[a-zA-Z0-9_-])/.test(href);
      const disabled = s("state") === "disabled" || s("state") === "loading";
      content = (
        <Button
          data-part-id="action"
          variant={
            s("variant") === "secondary"
              ? "outline"
              : s("variant") === "ghost"
                ? "ghost"
                : "default"
          }
          disabled={disabled}
          asChild={valid && !disabled}
        >
          {valid && !disabled ? (
            <a
              href={href}
              target={href.startsWith("https:") ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              {s("label")}
            </a>
          ) : (
            <span>{s("state") === "loading" ? "처리 중…" : s("label")}</span>
          )}
        </Button>
      );
      break;
    }
    case "input":
      content = (
        <label className="studio-field">
          <span data-part-id="title">{s("label")}</span>
          <Input
            data-part-id="control"
            type={s("type")}
            placeholder={s("placeholder")}
            required={!!node.props.required}
          />
        </label>
      );
      break;
    case "select":
      content = (
        <div className="studio-field">
          <label id={`${node.id}-label`} data-part-id="title">
            {s("label")}
          </label>
          <Select>
            <SelectTrigger
              aria-labelledby={`${node.id}-label`}
              data-part-id="control"
            >
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {lines(node).map((text, i) => (
                <SelectItem key={i} value={`${i}`} data-part-id={`item-${i}`}>
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
      break;
    case "tabs":
      content = (
        <Tabs defaultValue="0">
          <TabsList>
            {lines(node).map((line, i) => (
              <TabsTrigger key={i} value={`${i}`} data-part-id={`tab-${i}`}>
                {line.split("|")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {lines(node).map((line, i) => (
            <TabsContent
              className="py-5"
              key={i}
              value={`${i}`}
              data-part-id={`panel-${i}`}
            >
              {line.split("|")[1]}
            </TabsContent>
          ))}
        </Tabs>
      );
      break;
    case "dialog":
      content = (
        <Dialog>
          <DialogTrigger asChild>
            <Button data-part-id="action">{s("label")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-part-id="title">{s("title")}</DialogTitle>
              <DialogDescription data-part-id="description">
                {s("body")}
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button data-part-id="confirm">{s("confirm")}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
      break;
    case "calendar":
      content = (
        <div className="studio-field">
          <h3 data-part-id="title">{s("title")}</h3>
          <Calendar
            locale={ko}
            defaultMonth={
              /^\d{4}-(0[1-9]|1[0-2])$/.test(s("month"))
                ? new Date(`${s("month")}-01T12:00:00`)
                : undefined
            }
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border"
          />
        </div>
      );
      break;
    case "sidebar":
      content = (
        <SidebarProvider className="min-h-0">
          <Sidebar collapsible="none" className="w-full">
            <SidebarHeader>
              <strong data-part-id="brand">{s("brand")}</strong>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {lines(node).map((text, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      isActive={active === text}
                      onClick={() => setActive(text)}
                      data-part-id={`item-${i}`}
                    >
                      {text}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      break;
    case "table": {
      if (s("state") && s("state") !== "default") {
        content = (
          <p
            role={s("state") === "error" ? "alert" : "status"}
            data-part-id="status"
          >
            {s("state") === "loading"
              ? "데이터를 불러오는 중입니다…"
              : s("state") === "error"
                ? "데이터를 불러오지 못했습니다."
                : "표시할 데이터가 없습니다."}
          </p>
        );
        break;
      }
      const rows = lines(node, "rows").map((line, index) => ({
        cells: line.split("|"),
        index,
      }));
      if (sort)
        rows.sort(
          (a, b) =>
            String(a.cells[sort.index]).localeCompare(
              String(b.cells[sort.index]),
              "ko",
              { numeric: true },
            ) * (sort.reverse ? -1 : 1),
        );
      content = (
        <Table>
          <TableHeader>
            <TableRow>
              {s("columns")
                .split("|")
                .map((text, i) => (
                  <TableHead
                    key={i}
                    aria-sort={
                      sort?.index === i
                        ? sort.reverse
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    <button
                      onClick={() =>
                        setSort({
                          index: i,
                          reverse: sort?.index === i && !sort.reverse,
                        })
                      }
                      data-part-id={`head-${i}`}
                    >
                      {text}
                    </button>
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.index}>
                {row.cells.map((text, i) => (
                  <TableCell
                    key={i}
                    data-part-id={`cell-${row.index}-${i}`}
                    data-text-prop="rows"
                    data-text-row={row.index}
                    data-text-col={i}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
      break;
    }
  }
  return (
    <div className="studio-component" data-part-id="root">
      {content}
    </div>
  );
}
