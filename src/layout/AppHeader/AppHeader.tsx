import { Link, NavLink } from "react-router";
import { buttonClassName } from "@/components/Button/buttonClassName";
import { Icon } from "@/components/Icon/Icon";
import { IconButton } from "@/components/IconButton/IconButton";
import { iconButtonClassName } from "@/components/IconButton/iconButtonClassName";
import { SearchField } from "@/components/SearchField/SearchField";
import { FiltersButton } from "@/features/filters/FiltersButton/FiltersButton";
import type { Breakpoint } from "@/hooks/useMediaQuery";
import styles from "@/layout/AppHeader/AppHeader.module.css";
import { cx } from "@/utils/cx";

interface AppHeaderProps {
  breakpoint: Breakpoint;
  isPreferencesPage: boolean;
  keyword: string;
  onSearch: (keyword: string) => void;
  /** Phone: back button + search field instead of the title (keyword search only). */
  phoneSearchMode: boolean;
  onOpenPhoneSearch: () => void;
  onExitPhoneSearch: () => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

/** Phone: icon-only Filters button; a dot shows that filters are applied. */
function PhoneFiltersButton({
  activeCount,
  onClick,
}: {
  activeCount: number;
  onClick: () => void;
}) {
  return (
    <span className={styles.badgeHost}>
      <IconButton
        icon="sliders"
        label={activeCount ? `Filters, ${activeCount} active` : "Filters"}
        aria-haspopup="dialog"
        onClick={onClick}
      />
      {activeCount > 0 && <span className={styles.dot} aria-hidden="true" />}
    </span>
  );
}

const Brand = () => (
  <Link to="/" className={styles.brand}>
    News Aggregator
  </Link>
);

/** Phone: icons only. Tablet: inline search + Filters. Desktop: wide search with "/" + "Your feed". */
export function AppHeader(props: AppHeaderProps) {
  const { breakpoint, isPreferencesPage, keyword, onSearch } = props;

  if (breakpoint === "phone") return <PhoneHeader {...props} />;

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Brand />
        <SearchField
          className={styles.search}
          value={keyword}
          onSubmit={onSearch}
          shortcut={breakpoint === "desktop"}
        />
        {breakpoint === "tablet" && !isPreferencesPage && (
          <FiltersButton activeCount={props.activeFilterCount} onClick={props.onOpenFilters} />
        )}
        {breakpoint === "desktop" ? (
          <NavLink
            to="/preferences"
            className={cx(buttonClassName({ icon: "user" }), styles.feedLink)}
          >
            <Icon name="user" size={18} />
            Your feed
          </NavLink>
        ) : (
          <NavLink
            to="/preferences"
            aria-label="Your feed"
            className={cx(iconButtonClassName(), styles.iconLink)}
          >
            <Icon name="user" />
          </NavLink>
        )}
      </div>
    </header>
  );
}

function PhoneHeader({
  isPreferencesPage,
  keyword,
  onSearch,
  phoneSearchMode,
  onOpenPhoneSearch,
  onExitPhoneSearch,
  activeFilterCount,
  onOpenFilters,
}: AppHeaderProps) {
  const filtersButton = (
    <PhoneFiltersButton activeCount={activeFilterCount} onClick={onOpenFilters} />
  );

  if (isPreferencesPage) {
    return (
      <header className={styles.header}>
        <div className={cx(styles.bar, styles.backBar)}>
          <Link to="/" className={styles.backLink}>
            <span className={styles.backIcon}>
              <Icon name="back" />
            </span>
            Back to feed
          </Link>
        </div>
      </header>
    );
  }

  if (phoneSearchMode) {
    return (
      <header className={styles.header}>
        <div className={cx(styles.bar, styles.backBar)}>
          <IconButton icon="back" label="Back to feed" onClick={onExitPhoneSearch} />
          <SearchField
            value={keyword}
            onSubmit={onSearch}
            showIcon={false}
            prominent
            autoFocus={!keyword}
          />
          {filtersButton}
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Brand />
        <IconButton icon="search" label="Search" onClick={onOpenPhoneSearch} />
        {filtersButton}
        <Link to="/preferences" aria-label="Your feed" className={iconButtonClassName()}>
          <Icon name="user" />
        </Link>
      </div>
    </header>
  );
}
