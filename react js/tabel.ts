// Types used across components
type As<Props = any> = React.ElementType<Props>;

type ColorScheme = 'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'purple' | 'pink' | 'orange' | 'teal';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'solid' | 'outline' | 'ghost' | 'link';

interface ChakraProps {
  colorScheme?: ColorScheme;
  size?: Size;
  variant?: Variant;
}

// Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ChakraProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
  isFullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  colorScheme = 'blue',
  variant = 'solid',
  size = 'md',
  isFullWidth,
  leftIcon,
  rightIcon,
  isLoading,
  loadingText,
  isDisabled,
  ...props
}) => {
  const classes = [
    'custom-button',
    `button-${variant}`,
    `button-${colorScheme}`,
    `button-${size}`,
    isFullWidth ? 'button-full-width' : '',
    isDisabled ? 'button-disabled' : '',
    isLoading ? 'button-loading' : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={isDisabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className="loading-spinner"></span>
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="button-icon button-left-icon">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="button-icon button-right-icon">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// IconButton.tsx
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
  isRound?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  colorScheme = 'blue',
  variant = 'solid',
  size = 'md',
  isRound,
  isDisabled,
  ...props
}) => {
  const classes = [
    'custom-icon-button',
    `button-${variant}`,
    `button-${colorScheme}`,
    `button-${size}`,
    isRound ? 'button-round' : '',
    isDisabled ? 'button-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      aria-label={ariaLabel}
      disabled={isDisabled}
      {...props}
    >
      {icon}
    </button>
  );
};

// Box.tsx
interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: As;
  bg?: string;
  color?: string;
  m?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
  mx?: string | number;
  my?: string | number;
  p?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  px?: string | number;
  py?: string | number;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  borderRadius?: string | number;
  boxShadow?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
}

export const Box: React.FC<BoxProps> = ({
  children,
  as: Component = 'div',
  bg,
  color,
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  borderRadius,
  boxShadow,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  ...props
}) => {
  const style = {
    backgroundColor: bg,
    color,
    margin: m,
    marginTop: mt || my,
    marginRight: mr || mx,
    marginBottom: mb || my,
    marginLeft: ml || mx,
    padding: p,
    paddingTop: pt || py,
    paddingRight: pr || px,
    paddingBottom: pb || py,
    paddingLeft: pl || px,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    borderRadius,
    boxShadow,
    display,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
  };

  return <Component style={style} {...props}>{children}</Component>;
};

// Select.tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, ChakraProps {
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  placeholder,
  children,
  value,
  onChange,
  isDisabled,
  isInvalid,
  size = 'md',
  variant = 'outline',
  ...props
}) => {
  const classes = [
    'custom-select',
    `select-${variant}`,
    `select-${size}`,
    isInvalid ? 'select-invalid' : '',
    isDisabled ? 'select-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <select 
      className={classes}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

// Table components
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, ChakraProps {
}

export const Table: React.FC<TableProps> = ({
  children,
  variant = 'simple',
  size = 'md',
  colorScheme = 'gray',
  ...props
}) => {
  const classes = [
    'custom-table',
    `table-${variant}`,
    `table-${size}`,
    `table-${colorScheme}`,
  ].filter(Boolean).join(' ');

  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  overflowX?: string;
}

export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  overflowX = 'auto',
  ...props
}) => {
  return (
    <div className="table-container" style={{ overflowX }} {...props}>
      {children}
    </div>
  );
};

interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Thead: React.FC<TheadProps> = ({ children, ...props }) => {
  return <thead className="custom-thead" {...props}>{children}</thead>;
};

interface TbodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const Tbody: React.FC<TbodyProps> = ({ children, ...props }) => {
  return <tbody className="custom-tbody" {...props}>{children}</tbody>;
};

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Tr: React.FC<TrProps> = ({ children, ...props }) => {
  return <tr className="custom-tr" {...props}>{children}</tr>;
};

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isNumeric?: boolean;
}

export const Td: React.FC<TdProps> = ({ 
  children,
  isNumeric,
  ...props 
}) => {
  const classes = [
    'custom-td',
    isNumeric ? 'td-numeric' : '',
  ].filter(Boolean).join(' ');

  return <td className={classes} {...props}>{children}</td>;
};

// Menu components
interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ children, isOpen, onClose, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(isOpen || false);

  React.useEffect(() => {
    if (isOpen !== undefined) {
      setIsMenuOpen(isOpen);
    }
  }, [isOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="custom-menu-container" {...props}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === MenuButton) {
          return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
              setIsMenuOpen(!isMenuOpen);
              if (child.props.onClick) child.props.onClick(e);
            }
          });
        }
        
        if (child.type === MenuList) {
          return isMenuOpen ? React.cloneElement(child, { onClose: closeMenu }) : null;
        }
        
        return child;
      })}
    </div>
  );
};

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MenuButton: React.FC<MenuButtonProps> = ({ children, ...props }) => {
  return (
    <button className="custom-menu-button" {...props}>
      {children}
    </button>
  );
};

interface MenuListProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export const MenuList: React.FC<MenuListProps> = ({ children, onClose, ...props }) => {
  return (
    <div className="custom-menu-list" {...props}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === MenuItem) {
          return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
              if (child.props.onClick) child.props.onClick(e);
              if (onClose) onClose();
            }
          });
        }
        
        return child;
      })}
    </div>
  );
};

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MenuItem: React.FC<MenuItemProps> = ({ children, ...props }) => {
  return (
    <button className="custom-menu-item" {...props}>
      {children}
    </button>
  );
};

// Tooltip
interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  hasArrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  label,
  placement = 'top',
  hasArrow,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${placement} ${hasArrow ? 'tooltip-has-arrow' : ''}`}>
          {label}
        </div>
      )}
    </div>
  );
};

// Switch
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, ChakraProps {
  id: string;
  isChecked?: boolean;
  isDisabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  isChecked,
  isDisabled,
  onChange,
  size = 'md',
  colorScheme = 'blue',
  ...props
}) => {
  const classes = [
    'custom-switch',
    `switch-${size}`,
    `switch-${colorScheme}`,
    isDisabled ? 'switch-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        {...props}
      />
      <span className="switch-slider"></span>
    </label>
  );
};

// Popover components
interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  isOpen,
  onClose,
  placement = 'bottom',
  ...props
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(isOpen || false);

  React.useEffect(() => {
    if (isOpen !== undefined) {
      setIsPopoverOpen(isOpen);
    }
  }, [isOpen]);

  const closePopover = () => {
    setIsPopoverOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="custom-popover-container" {...props}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, {
            onClick: (e: React.MouseEvent) => {
              setIsPopoverOpen(!isPopoverOpen);
              if (child.props.onClick) child.props.onClick(e);
            }
          });
        }
        
        if (child.type === PopoverContent) {
          return isPopoverOpen ? React.cloneElement(child, { 
            onClose: closePopover,
            placement 
          }) : null;
        }
        
        return child;
      })}
    </div>
  );
};

interface PopoverTriggerProps {
  children: React.ReactElement;
  onClick?: (e: React.MouseEvent) => void;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, ...props }) => {
  return React.cloneElement(children, { ...props });
};

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  onClose,
  placement,
  ...props
}) => {
  return (
    <div className={`custom-popover-content popover-${placement}`} {...props}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === PopoverCloseButton) {
          return React.cloneElement(child, { onClick: onClose });
        }
        
        return child;
      })}
    </div>
  );
};

export const PopoverArrow: React.FC = (props) => {
  return <div className="custom-popover-arrow" {...props}></div>;
};

interface PopoverCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PopoverCloseButton: React.FC<PopoverCloseButtonProps> = (props) => {
  return (
    <button className="custom-popover-close-button" {...props}>
      &times;
    </button>
  );
};

interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PopoverHeader: React.FC<PopoverHeaderProps> = ({ children, ...props }) => {
  return <div className="custom-popover-header" {...props}>{children}</div>;
};

interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PopoverBody: React.FC<PopoverBodyProps> = ({ children, ...props }) => {
  return <div className="custom-popover-body" {...props}>{children}</div>;
};

// Form components
interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const FormControl: React.FC<FormControlProps> = ({
  children,
  isInvalid,
  isDisabled,
  isRequired,
  ...props
}) => {
  const classes = [
    'custom-form-control',
    isInvalid ? 'form-control-invalid' : '',
    isDisabled ? 'form-control-disabled' : '',
    isRequired ? 'form-control-required' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        // Pass down isInvalid and isDisabled to appropriate children
        const childProps: any = {};
        
        if (
          child.type === Input || 
          child.type === FormLabel || 
          child.type === FormErrorMessage
        ) {
          if (isInvalid !== undefined) childProps.isInvalid = isInvalid;
          if (isDisabled !== undefined) childProps.isDisabled = isDisabled;
          if (isRequired !== undefined) childProps.isRequired = isRequired;
        }
        
        return Object.keys(childProps).length > 0
          ? React.cloneElement(child, childProps)
          : child;
      })}
    </div>
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  isRequired?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  htmlFor,
  isRequired,
  ...props
}) => {
  const classes = [
    'custom-form-label',
    isRequired ? 'form-label-required' : '',
  ].filter(Boolean).join(' ');

  return (
    <label className={classes} htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

export const InputGroup: React.FC<InputGroupProps> = ({ children, size = 'md', ...props }) => {
  const classes = [
    'custom-input-group',
    `input-group-${size}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

interface InputLeftElementProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputLeftElement: React.FC<InputLeftElementProps> = ({ children, ...props }) => {
  return (
    <div className="custom-input-left-element" {...props}>
      {children}
    </div>
  );
};

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, ChakraProps {
  value?: string | number;
  placeholder?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  size = 'md',
  variant = 'outline',
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  ...props
}) => {
  const classes = [
    'custom-input',
    `input-${variant}`,
    `input-${size}`,
    isInvalid ? 'input-invalid' : '',
    isDisabled ? 'input-disabled' : '',
    isReadOnly ? 'input-readonly' : '',
  ].filter(Boolean).join(' ');

  return (
    <input
      className={classes}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      {...props}
    />
  );
};

interface FormErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ children, ...props }) => {
  return (
    <div className="custom-form-error-message" {...props}>
      {children}
    </div>
  );
};