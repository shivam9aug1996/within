"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "./components/session";
import { AppHeader } from "./components/app-header";
import { HomeScreen } from "./components/home-screen";
import { HistoryScreen } from "./components/history-screen";
import { KindScreen } from "./components/kind-screen";
import { NameScreen } from "./components/name-screen";
import { CustomNameScreen } from "./components/custom-name-screen";
import { ModeScreen } from "./components/mode-screen";
import { settingsForKind } from "./lib/saved-choices";
import { translations } from "./lib/translations";
import type { Kind, PracticeView } from "./lib/types";
import { usePractice } from "./practice-provider";
export function PracticeApp({
  view = "home",
}: {
  view?: PracticeView;
}) {
  const store = usePractice();
  const router = useRouter();
  const saved = store.snapshot();
  const t = translations[saved.settings.language];
  const pending = Boolean(saved.session && !saved.session.completed);
  const returning = (saved.history?.length ?? 0) > 0;
  const resume = pending && !store.autoStart;
  const [quiet, setQuiet] = useState(false);
  const onQuiet = useCallback((next: boolean) => setQuiet(next), []);
  const sanctum = view === "practice" && (!store.ready || pending || quiet);
  useEffect(() => {
    document.documentElement.lang = saved.settings.language;
  }, [saved.settings.language]);
  const start = () => {
    store.start();
    if (view !== "practice") router.push("/practice");
  };
  const chooseKind = (kind: Kind) => {
    store.updateSettings(
      settingsForKind(
        saved.settings,
        kind,
        saved.savedChoices ?? [],
        saved.history ?? [],
      ),
    );
    router.push("/choose/name");
  };
  return (
    <div className={sanctum ? "app-shell is-sanctum" : "app-shell"}>
      <AppHeader
        view={view}
        language={saved.settings.language}
        copy={t}
        sanctum={sanctum}
        onLanguage={(language) =>
          store.updateSettings({ ...saved.settings, language })
        }
      />
      <main id="main-content">
        {!store.ready ? (
          <p className="loading" role="status">
            {t.loading}
          </p>
        ) : view === "history" ? (
          <HistoryScreen
            entries={saved.history ?? []}
            language={saved.settings.language}
            copy={t}
          />
        ) : resume &&
          (view === "choose" ||
            view === "name" ||
            view === "custom" ||
            view === "mode" ||
            view === "home") ? (
          <HomeScreen
            saved={saved}
            copy={t}
            resume
            onStart={start}
            onChooseKind={chooseKind}
          />
        ) : view === "choose" ? (
          <KindScreen
            copy={t}
            selectedKind={saved.settings.kind}
            onChoose={chooseKind}
          />
        ) : view === "name" ? (
          <NameScreen
            saved={saved}
            settings={saved.settings}
            copy={t}
            onChange={store.updateSettings}
            onContinue={() => router.push("/choose/mode")}
            onAddOwn={() => {
              store.setEditing(null);
              router.push("/choose/name/new");
            }}
            onEdit={(choice) => {
              store.setEditing(choice);
              router.push("/choose/name/new");
            }}
            onDelete={store.removeChoice}
            backHref={returning ? "/choose" : "/"}
          />
        ) : view === "custom" ? (
          <CustomNameScreen
            key={store.editing ? `${store.editing.kind}:${store.editing.text}` : "new"}
            copy={t}
            kind={saved.settings.kind}
            editingText={
              store.editing
                ? saved.settings.language === "hi"
                  ? store.editing.hindi || store.editing.text
                  : store.editing.english || store.editing.text
                : ""
            }
            onCommit={(patch) => {
              const next = { ...saved.settings, ...patch };
              if (store.editing) {
                store.replaceChoice(store.editing, next);
                store.setEditing(null);
                router.push("/choose/name");
                return;
              }
              store.updateSettings(next);
              store.saveChoice();
              router.push("/choose/mode");
            }}
          />
        ) : view === "mode" ? (
          <ModeScreen
            settings={saved.settings}
            copy={t}
            onChange={store.updateSettings}
            onStart={start}
          />
        ) : view === "home" ? (
          <HomeScreen
            saved={saved}
            copy={t}
            onStart={start}
            onChooseKind={chooseKind}
          />
        ) : saved.session ? (
          <Session
            key={saved.session.id ?? "legacy"}
            settings={saved.settings}
            initial={saved.session}
            copy={t}
            onSave={store.saveSession}
            onAgain={start}
            onHome={() => router.push("/")}
            onLeave={() => {
              store.discardSession();
              router.push("/");
            }}
            autoStart={store.autoStart}
            onMounted={store.consumeAutoStart}
            onQuiet={onQuiet}
            onSound={(sound) =>
              store.updateSettings({ ...saved.settings, sound })
            }
          />
        ) : (
          <section className="empty-history">
            <p>{t.noSession}</p>
            <Link className="primary-button" href="/">
              {t.back}
            </Link>
          </section>
        )}
        {store.storageError && (
          <p className="storage-warning" role="status">
            {t.storage}
          </p>
        )}
      </main>
      {!sanctum && <footer className="site-footer">{t.footer}</footer>}
    </div>
  );
}