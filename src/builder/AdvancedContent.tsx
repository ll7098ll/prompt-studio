"use client";
import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Copy,
  Eye,
  EyeOff,
  File,
  Folder,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { Node } from "./model";
import { Button } from "./vendor/shadcn/button";
import { Input } from "./vendor/shadcn/input";
import { Calendar } from "./vendor/shadcn/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./vendor/shadcn/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./vendor/shadcn/command";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "./vendor/shadcn/input-otp";
import { ToggleGroup, ToggleGroupItem } from "./vendor/shadcn/toggle-group";
import { Toggle } from "./vendor/shadcn/toggle";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "./vendor/shadcn/context-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "./vendor/shadcn/menubar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./vendor/shadcn/navigation-menu";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./vendor/shadcn/hover-card";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./vendor/shadcn/sheet";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./vendor/shadcn/drawer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./vendor/shadcn/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./vendor/shadcn/carousel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./vendor/shadcn/resizable";
import { ScrollArea } from "./vendor/shadcn/scroll-area";

const value = (node: Node, key: string) => String(node.props[key] ?? "");
const items = (node: Node, key = "items") =>
  value(node, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const slot = (id: string) => ({ "data-part-id": id });
function CopyControl({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");
  return (
    <>
      <Button
        {...slot("action")}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus("복사했습니다.");
          } catch {
            setStatus("복사할 내용을 선택해 주세요.");
          }
        }}
      >
        <Copy aria-hidden className="size-4" />
        {label}
      </Button>
      <span className="studio-status" role="status">
        {status}
      </span>
      {status.includes("선택") && (
        <textarea
          aria-label="복사할 내용"
          value={text}
          readOnly
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </>
  );
}
function Picker({
  node,
  multiple = false,
}: {
  node: Node;
  multiple?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="studio-field">
      <label {...slot("title")} id={`${node.id}-label`}>
        {value(node, "label")}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-labelledby={`${node.id}-label`}
            aria-expanded={open}
            className="w-full justify-between"
            {...slot("control")}
          >
            {selected.length ? selected.join(", ") : value(node, "placeholder")}
            <ChevronsUpDown aria-hidden className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput
              placeholder={value(node, "placeholder")}
              aria-label="항목 검색"
            />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {items(node).map((text, i) => (
                  <CommandItem
                    key={text}
                    value={text}
                    onSelect={() => {
                      setSelected((old) =>
                        multiple
                          ? old.includes(text)
                            ? old.filter((x) => x !== text)
                            : [...old, text]
                          : [text],
                      );
                      if (!multiple) setOpen(false);
                    }}
                  >
                    <Check
                      aria-hidden
                      className={`size-4 ${selected.includes(text) ? "opacity-100" : "opacity-0"}`}
                    />
                    <span {...slot(`item-${i}`)}>{text}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
function Chart({ node }: { node: Node }) {
  const data = items(node).map((line) => {
    const [label, n] = line.split("|");
    return { label, value: Math.max(0, Math.min(100000, Number(n) || 0)) };
  });
  const max = Math.max(1, ...data.map((d) => d.value));
  const points = data
    .map(
      (d, i) =>
        `${24 + (i * 352) / Math.max(1, data.length - 1)},${166 - (d.value / max) * 130}`,
    )
    .join(" ");
  const radar = data
    .map((d, i) => {
      const a = (i * 2 * Math.PI) / Math.max(1, data.length) - Math.PI / 2;
      return `${200 + ((Math.cos(a) * d.value) / max) * 90},${110 + ((Math.sin(a) * d.value) / max) * 90}`;
    })
    .join(" ");
  return (
    <section className="studio-chart">
      <h3 {...slot("title")}>{value(node, "title")}</h3>
      {node.component === "heatmap" ? (
        <div className="studio-heatmap">
          {data.map((d, i) => (
            <div
              key={i}
              {...slot(`cell-${i}`)}
              style={{
                background: `color-mix(in srgb, var(--ui-primary) ${15 + (d.value / max) * 70}%, var(--ui-surface))`,
              }}
            >
              <span>{d.label}</span>
              <strong>{d.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <svg
          viewBox="0 0 400 220"
          role="img"
          aria-label={`${value(node, "title")}: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}
        >
          <title>{value(node, "title")}</title>
          {[36, 79, 122, 166].map((y) => (
            <line
              key={y}
              x1="24"
              x2="376"
              y1={y}
              y2={y}
              stroke="var(--ui-border)"
              strokeDasharray="4 5"
            />
          ))}
          {node.component === "radar-chart" ? (
            <polygon
              points={radar}
              fill="color-mix(in srgb,var(--ui-primary) 25%,transparent)"
              stroke="var(--ui-primary)"
              strokeWidth="3"
            />
          ) : (
            <>
              {node.component === "area-chart" && (
                <polygon
                  points={`24,166 ${points} 376,166`}
                  fill="color-mix(in srgb,var(--ui-primary) 18%,transparent)"
                />
              )}
              <polyline
                points={points}
                fill="none"
                stroke="var(--ui-primary)"
                strokeWidth="3"
              />
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={24 + (i * 352) / Math.max(1, data.length - 1)}
                  cy={166 - (d.value / max) * 130}
                  r="4"
                  fill="var(--ui-primary)"
                >
                  <title>
                    {d.label}: {d.value}
                  </title>
                </circle>
              ))}
            </>
          )}
          {data.map((d, i) => (
            <text
              key={i}
              x={24 + (i * 352) / Math.max(1, data.length - 1)}
              y="202"
              textAnchor="middle"
              fontSize="11"
              fill="var(--ui-muted)"
            >
              {d.label}
            </text>
          ))}
        </svg>
      )}
      <div className="studio-chart-legend">
        {data.map((d, i) => (
          <span key={i} {...slot(`value-${i}`)}>
            {d.label} <b>{d.value}</b>
          </span>
        ))}
      </div>
    </section>
  );
}
export default function AdvancedContent({ node }: { node: Node }) {
  const [status, setStatus] = useState(""),
    [query, setQuery] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [range, setRange] = useState<DateRange | undefined>(),
    [selected, setSelected] = useState(""),
    [listView, setListView] = useState(false);
  const title = value(node, "title"),
    label = value(node, "label"),
    body = value(node, "body");
  const action = value(node, "action");
  let content;
  switch (node.component) {
    case "combobox":
      return (
        <div className="studio-component" {...slot("root")}>
          <Picker node={node} />
        </div>
      );
    case "multi-select":
      return (
        <div className="studio-component" {...slot("root")}>
          <Picker node={node} multiple />
        </div>
      );
    case "input-otp":
      content = (
        <div className="studio-field">
          <label htmlFor={`${node.id}-otp`} {...slot("title")}>
            {label}
          </label>
          <InputOTP
            id={`${node.id}-otp`}
            aria-label={label}
            maxLength={6}
            pattern="[0-9]*"
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <p {...slot("description")}>{body}</p>
        </div>
      );
      break;
    case "input-group":
      content = (
        <label className="studio-field">
          <span {...slot("title")}>{label}</span>
          <span className="studio-input-group">
            <span {...slot("prefix")}>{value(node, "prefix")}</span>
            <Input
              placeholder={value(node, "placeholder")}
              aria-label={label}
              {...slot("control")}
            />
            <span {...slot("suffix")}>{value(node, "suffix")}</span>
          </span>
        </label>
      );
      break;
    case "password-input":
      content = (
        <label className="studio-field">
          <span {...slot("title")}>{label}</span>
          <span className="studio-input-group">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={value(node, "placeholder")}
              {...slot("control")}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </Button>
          </span>
        </label>
      );
      break;
    case "date-range-picker":
      content = (
        <div className="studio-field">
          <span {...slot("title")}>{label}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" {...slot("control")}>
                {range?.from
                  ? `${range.from.toLocaleDateString("ko-KR")} ~ ${range.to?.toLocaleDateString("ko-KR") ?? "종료일 선택"}`
                  : "날짜 범위를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
      );
      break;
    case "color-swatch":
      content = (
        <fieldset className="studio-field">
          <legend {...slot("title")}>{label}</legend>
          <div className="studio-swatches">
            {items(node)
              .filter((color) => /^#[0-9a-f]{6}$/i.test(color))
              .map((color, i) => (
                <button
                  key={color}
                  {...slot(`color-${i}`)}
                  aria-label={color}
                  aria-pressed={selected === color}
                  style={{ background: color }}
                  onClick={() => setSelected(color)}
                >
                  {selected === color && <Check aria-hidden />}
                </button>
              ))}
          </div>
          <output>{selected || "색상을 선택하세요"}</output>
        </fieldset>
      );
      break;
    case "toggle-group":
      content = (
        <div className="studio-field">
          <span {...slot("title")}>{label}</span>
          <ToggleGroup type="multiple" variant="outline" aria-label={label}>
            {items(node).map((text, i) => (
              <ToggleGroupItem key={i} value={text} {...slot(`item-${i}`)}>
                {text}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      );
      break;
    case "command-palette":
      content = (
        <Command className="rounded-xl border">
          <h3 className="px-4 pt-4 font-semibold" {...slot("title")}>
            {title}
          </h3>
          <CommandInput placeholder="명령 검색..." aria-label="명령 검색" />
          <CommandList>
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {items(node).map((text, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => setStatus(`선택: ${text}`)}
                  {...slot(`item-${i}`)}
                >
                  {text}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
      break;
    case "context-menu":
      content = (
        <ContextMenu>
          <ContextMenuTrigger
            className="studio-context-target"
            {...slot("title")}
          >
            {label}
          </ContextMenuTrigger>
          <ContextMenuContent>
            {items(node).map((text, i) => (
              <ContextMenuItem
                key={i}
                onSelect={() => setStatus(`선택: ${text}`)}
                {...slot(`item-${i}`)}
              >
                {text}
              </ContextMenuItem>
            ))}
          </ContextMenuContent>
        </ContextMenu>
      );
      break;
    case "menubar":
      content = (
        <Menubar>
          {items(node).map((text, i) => (
            <MenubarMenu key={i}>
              <MenubarTrigger {...slot(`menu-${i}`)}>{text}</MenubarTrigger>
              <MenubarContent>
                {items(node, "actions").map((action, j) => (
                  <MenubarItem
                    key={j}
                    onSelect={() => setStatus(`${text}: ${action}`)}
                  >
                    {action}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>
      );
      break;
    case "mega-menu":
      content = (
        <div className="studio-mega">
          <strong {...slot("brand")}>{value(node, "brand")}</strong>
          <NavigationMenu>
            <NavigationMenuList>
              {items(node).map((text, i) => (
                <NavigationMenuItem key={i}>
                  <NavigationMenuTrigger {...slot(`menu-${i}`)}>
                    {text}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="studio-mega-links">
                      {items(node, "links").map((link, j) => {
                        const [name, description] = link.split("|");
                        return (
                          <li key={j}>
                            <button onClick={() => setStatus(`선택: ${name}`)}>
                              <strong>{name}</strong>
                              <small>{description}</small>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      );
      break;
    case "popover":
      content = (
        <Popover>
          <PopoverTrigger asChild>
            <Button {...slot("action")}>{label}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <h3 {...slot("title")}>{title}</h3>
            <p {...slot("description")}>{body}</p>
          </PopoverContent>
        </Popover>
      );
      break;
    case "hover-card":
      content = (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" {...slot("action")}>
              {label}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <h3 {...slot("title")}>{title}</h3>
            <p {...slot("description")}>{body}</p>
          </HoverCardContent>
        </HoverCard>
      );
      break;
    case "sheet":
      content = (
        <Sheet>
          <SheetTrigger asChild>
            <Button {...slot("action")}>{label}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle {...slot("title")}>{title}</SheetTitle>
              <SheetDescription {...slot("description")}>
                {body}
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button>{action}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
      break;
    case "drawer":
      content = (
        <Drawer>
          <DrawerTrigger asChild>
            <Button {...slot("action")}>{label}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle {...slot("title")}>{title}</DrawerTitle>
              <DrawerDescription {...slot("description")}>
                {body}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>{action}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
      break;
    case "alert-dialog":
      content = (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" {...slot("action")}>
              {label}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle {...slot("title")}>{title}</AlertDialogTitle>
              <AlertDialogDescription {...slot("description")}>
                {body}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={() => setStatus("확인했습니다.")}>
                {action}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      break;
    case "carousel":
      content = (
        <section className="studio-carousel">
          <h3 {...slot("title")}>{title}</h3>
          <Carousel className="mx-10">
            <CarouselContent>
              {items(node).map((text, i) => {
                const [number, body] = text.split("|");
                return (
                  <CarouselItem key={i}>
                    <div className="studio-slide" {...slot(`slide-${i}`)}>
                      <span>{number}</span>
                      <h4>{body ?? number}</h4>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      );
      break;
    case "tree-view": {
      const folders = [
        ...new Set(items(node).map((line) => line.split("/")[0])),
      ];
      content = (
        <section className="studio-tree">
          <h3 {...slot("title")}>{title}</h3>
          {folders.map((folder, i) => (
            <details key={folder} open>
              <summary {...slot(`folder-${i}`)}>
                <Folder aria-hidden size={16} />
                {folder}
              </summary>
              <ul>
                {items(node)
                  .filter((s) => s.startsWith(folder + "/"))
                  .map((line, j) => (
                    <li key={j}>
                      <button
                        aria-pressed={selected === line}
                        onClick={() => setSelected(line)}
                      >
                        <File aria-hidden size={15} />
                        {line.split("/").slice(1).join("/")}
                      </button>
                    </li>
                  ))}
              </ul>
            </details>
          ))}
          <output>{selected && `선택: ${selected}`}</output>
        </section>
      );
      break;
    }
    case "file-manager":
      content = (
        <section className="studio-files">
          <div className="studio-section-heading">
            <h3 {...slot("title")}>{title}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setListView(!listView)}
            >
              {listView ? "격자 보기" : "목록 보기"}
            </Button>
          </div>
          <Input
            aria-label="파일 검색"
            placeholder="파일 이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div
            className={listView ? "studio-file-grid list" : "studio-file-grid"}
          >
            {items(node)
              .filter((line) =>
                line.toLowerCase().includes(query.toLowerCase()),
              )
              .map((line, i) => {
                const [name, size] = line.split("|");
                return (
                  <button
                    key={line}
                    {...slot(`file-${i}`)}
                    aria-pressed={selected === name}
                    onClick={() => setSelected(name)}
                  >
                    <File aria-hidden />
                    <strong>{name}</strong>
                    <small>{size}</small>
                  </button>
                );
              })}
          </div>
          {!items(node).some((line) =>
            line.toLowerCase().includes(query.toLowerCase()),
          ) && <p>검색 결과가 없습니다.</p>}
          <output>{selected && `선택: ${selected}`}</output>
        </section>
      );
      break;
    case "code-block":
    case "terminal":
      content = (
        <section
          className={`studio-code ${node.component === "terminal" ? "studio-terminal" : ""}`}
        >
          <div className="studio-section-heading">
            <h3 {...slot("title")}>{title}</h3>
            <CopyControl text={value(node, "code")} label="복사" />
          </div>
          <pre {...slot("code")}>
            <code>{value(node, "code")}</code>
          </pre>
        </section>
      );
      break;
    case "line-chart":
    case "area-chart":
    case "radar-chart":
    case "heatmap":
      content = <Chart node={node} />;
      break;
    case "resizable-panels":
      content = (
        <section>
          <h3 {...slot("title")}>{title}</h3>
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-52 rounded-xl border"
          >
            <ResizablePanel defaultSize="35%" minSize="15%">
              <div className="p-5" {...slot("left")}>
                {value(node, "left")}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize="20%">
              <div className="p-5" {...slot("right")}>
                {value(node, "right")}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </section>
      );
      break;
    case "scroll-area":
      content = (
        <section>
          <h3 {...slot("title")}>{title}</h3>
          <ScrollArea className="h-60 rounded-xl border">
            <ul className="p-4">
              {items(node).map((text, i) => (
                <li
                  key={i}
                  className="border-b py-3 text-sm"
                  {...slot(`item-${i}`)}
                >
                  {text}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </section>
      );
      break;
    case "toggle-button":
      content = (
        <Toggle
          variant="outline"
          defaultPressed={!!node.props.pressed}
          {...slot("action")}
        >
          {label}
        </Toggle>
      );
      break;
    case "copy-button":
      content = <CopyControl text={value(node, "text")} label={label} />;
      break;
    default:
      return null;
  }
  return (
    <div className="studio-component" {...slot("root")}>
      {content}
      {status && (
        <p className="studio-status" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
