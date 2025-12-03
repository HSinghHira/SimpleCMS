import React, { useEffect, useRef } from "react";
import { enableKeyboardNavigation } from "@harshtalks/slash-tiptap";
import { Heading1, Heading2, List, ListOrdered, CodeXml, Quote } from "lucide-react";
const iconMap = {
  "Heading 1": <Heading1 size={18} />,
  "Heading 2": <Heading2 size={18} />,
  "Bullet List": <List size={18} />,
  "Numbered List": <ListOrdered size={18} />,
  "Code Block": <CodeXml size={18} />,
  Quote: <Quote size={18} />
};
const SlashMenuItem = ({
  item,
  command
}) => {
  const Icon = iconMap[item.title];
  return <button className="slash-menu-item" onClick={() => command(item)}>
      <span className="slash-menu-item-icon">{Icon}</span>
      <span className="slash-menu-item-title">{item.title}</span>
    </button>;
};
const SlashMenuComponent = ({
  items,
  command
}) => {
  const listRef = useRef(null);
  useEffect(() => {
    enableKeyboardNavigation(listRef.current);
  }, []);
  return <div className="slash-menu">
      {items.length ? <div ref={listRef} className="slash-menu-list">
          {items.map((item, index) => <SlashMenuItem key={index} item={item} command={command} />)}
        </div> : <div className="slash-menu-empty">No results</div>}
    </div>;
};
export default SlashMenuComponent;