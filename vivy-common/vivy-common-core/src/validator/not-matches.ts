import type { ValidationOptions } from 'class-validator'
import { matches, buildMessage, ValidateBy, isValidationOptions } from 'class-validator'

export const NOT_MATCHES = 'notMatches'

/**
 * Checks if string not matches the pattern. Either matches('foo', /<^&>/i).
 * If given value is not a string, then it returns false.
 */
export function notMatches(value: string, pattern: RegExp): value is string
export function notMatches(value: string, pattern: string, modifiers?: string): value is string
export function notMatches(value: string, pattern: RegExp | string, modifiers?: string): value is string {
  return !matches(value, pattern as string, modifiers)
}

/**
 * Checks if string not matches the pattern. Either matches('foo', /<^&>/i)
 * If given value is not a string, then it returns false.
 */
export function NotMatches(pattern: RegExp, validationOptions?: ValidationOptions): PropertyDecorator
export function NotMatches(
  pattern: string,
  modifiers?: string,
  validationOptions?: ValidationOptions
): PropertyDecorator
export function NotMatches(
  pattern: RegExp | string,
  modifiersOrAnnotationOptions?: string | ValidationOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  let modifiers: string
  if (isValidationOptions(modifiersOrAnnotationOptions) && !validationOptions) {
    validationOptions = modifiersOrAnnotationOptions
  } else {
    modifiers = modifiersOrAnnotationOptions as string
  }

  return ValidateBy(
    {
      name: NOT_MATCHES,
      constraints: [pattern, modifiers],
      validator: {
        validate: (value, args): boolean => notMatches(value, args?.constraints[0], args?.constraints[1]),
        defaultMessage: buildMessage(
          (eachPrefix, args) => eachPrefix + '$property must not match $constraint1 regular expression',
          validationOptions
        ),
      },
    },
    validationOptions
  )
}
