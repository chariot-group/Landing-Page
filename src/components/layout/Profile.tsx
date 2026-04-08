"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useKeycloak } from "@/providers/KeycloakProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProfileProps {
  accountHref: string;
  onAction?: () => void;
  avatarClassName?: string;
}

export default function Profile({
  accountHref,
  onAction,
  avatarClassName,
}: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const collapsibleTriggerRef = useRef<HTMLButtonElement>(null);
  const collapsibleContentRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("header");
  const { keycloak, logout } = useKeycloak();

  const firstName = keycloak?.tokenParsed?.given_name;
  const lastName = keycloak?.tokenParsed?.family_name;
  const username =
    keycloak?.tokenParsed?.preferred_username ||
    keycloak?.tokenParsed?.name ||
    keycloak?.tokenParsed?.email;

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (typeof username === "string" && username.length > 0) {
      return username.slice(0, 2).toUpperCase();
    }

    return "??";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger =
        collapsibleTriggerRef.current &&
        !collapsibleTriggerRef.current.contains(target);
      const isOutsideContent =
        collapsibleContentRef.current &&
        !collapsibleContentRef.current.contains(target);

      if (isOutsideTrigger && isOutsideContent) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    onAction?.();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="relative">
      <CollapsibleTrigger
        ref={collapsibleTriggerRef}
        className="w-auto"
        aria-label={t("myAccount")}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar
          className={cn(
            "h-10 w-10 cursor-pointer border border-white/25 sm:h-11 sm:w-11",
            avatarClassName,
          )}
        >
          <AvatarImage
            className="bg-gray-middle-light"
            src={undefined}
            alt={
              typeof username === "string"
                ? `${username} avatar`
                : "User avatar"
            }
          />
          <AvatarFallback className="bg-gray-middle-light text-white font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </CollapsibleTrigger>

      <CollapsibleContent
        ref={collapsibleContentRef}
        role="menu"
        aria-label={t("myAccount")}
        className="absolute right-0 top-12 z-50 flex min-w-max flex-col rounded-[15px] border border-white/10 bg-card px-3 py-1.5 text-popover-foreground shadow-lg sm:top-14"
      >
        <Link
          className="flex items-center gap-2 rounded-[15px] px-2 py-1.5 text-sm transition-colors hover:bg-white/10 sm:text-base"
          href={accountHref}
          onClick={closeMenu}
          role="menuitem"
        >
          <User className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
          <span className="inline-block min-w-24 whitespace-nowrap sm:min-w-32">
            {t("myAccount")}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            closeMenu();
            logout();
          }}
          role="menuitem"
          className="flex w-full cursor-pointer items-center gap-2 rounded-[15px] px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/10 sm:text-base"
        >
          <LogOut
            className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
            aria-hidden="true"
          />
          <span className="inline-block min-w-24 whitespace-nowrap sm:min-w-32">
            {t("logout")}
          </span>
        </button>
      </CollapsibleContent>
    </Collapsible>
  );
}
