import { useEffect, useRef } from "react";
import { MESSAGES } from "../config/messages";

export const useAccessibility = () => {
  const announcerRef = useRef(null);

  const announce = (message) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  };

  const getAriaProps = (type) => {
    switch (type) {
      case "dragHandle":
        return {
          role: "button",
          "aria-label": MESSAGES.ACCESSIBILITY.DRAG_HANDLE,
          tabIndex: 0,
        };
      case "deleteButton":
        return {
          role: "button",
          "aria-label": MESSAGES.ACCESSIBILITY.DELETE_BUTTON,
          tabIndex: 0,
        };
      case "previewButton":
        return {
          role: "button",
          "aria-label": MESSAGES.ACCESSIBILITY.PREVIEW_BUTTON,
          tabIndex: 0,
        };
      case "image":
        return {
          role: "img",
          "aria-label": MESSAGES.ACCESSIBILITY.IMAGE_ALT,
        };
      case "error":
        return {
          role: "alert",
          "aria-live": "assertive",
        };
      case "success":
        return {
          role: "status",
          "aria-live": "polite",
        };
      case "loading":
        return {
          role: "progressbar",
          "aria-busy": "true",
          "aria-label": MESSAGES.ACCESSIBILITY.LOADING,
        };
      default:
        return {};
    }
  };

  const handleKeyboardNavigation = (event, handlers) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handlers.onActivate?.();
        break;
      case "ArrowUp":
        event.preventDefault();
        handlers.onMoveUp?.();
        break;
      case "ArrowDown":
        event.preventDefault();
        handlers.onMoveDown?.();
        break;
      case "Escape":
        event.preventDefault();
        handlers.onEscape?.();
        break;
      default:
        break;
    }
  };

  // Create an invisible live region for screen reader announcements
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.style.position = "absolute";
      announcer.style.width = "1px";
      announcer.style.height = "1px";
      announcer.style.padding = "0";
      announcer.style.overflow = "hidden";
      announcer.style.clip = "rect(0, 0, 0, 0)";
      announcer.style.whiteSpace = "nowrap";
      announcer.style.border = "0";
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (
        announcerRef.current &&
        document.body.contains(announcerRef.current)
      ) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  return {
    announce,
    getAriaProps,
    handleKeyboardNavigation,
  };
};
