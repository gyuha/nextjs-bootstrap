import * as React from "react";
import {
	Controller,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
	useFormContext,
} from "react-hook-form";

const Form = useFormContext;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const formContext = useFormContext();

	// Handle SSR case where formContext might be null
	const formState = formContext?.formState;
	const fieldState = formState?.errors?.[fieldContext.name];

	if (!itemContext) {
		throw new Error("useFormField should be used within <FormItem>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		error: fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

const FormItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div ref={ref} className={className} {...props} />
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
	const { formItemId } = useFormField();

	return (
		<label ref={ref} className={className} htmlFor={formItemId} {...props} />
	);
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
	const { formItemId, formDescriptionId, formMessageId } = useFormField();

	return (
		<div
			ref={ref}
			id={formItemId}
			aria-describedby={
				!props["aria-describedby"]
					? `${formDescriptionId} ${formMessageId}`
					: props["aria-describedby"]
			}
			{...props}
		/>
	);
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	return (
		<p ref={ref} id={formDescriptionId} className={className} {...props} />
	);
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { formMessageId, error } = useFormField();

	const body = error ? String(error?.message || "") : children;

	if (!body) {
		return null;
	}

	return (
		<p ref={ref} id={formMessageId} className={className} {...props}>
			{body}
		</p>
	);
});
FormMessage.displayName = "FormMessage";

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};
