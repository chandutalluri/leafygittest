export declare const BranchContext: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const RequireBranch: () => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare const CurrentBranchId: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const CurrentCompanyId: (...dataOrPipes: unknown[]) => ParameterDecorator;
