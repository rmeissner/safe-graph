import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  AddedOwner,
  ApproveHash,
  ChangedMasterCopy,
  ChangedThreshold,
  DisabledModule,
  EnabledModule,
  ExecutionFailure,
  ExecutionFromModuleFailure,
  ExecutionFromModuleSuccess,
  ExecutionSuccess,
  RemovedOwner,
  SignMsg
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleAddedOwner(event: AddedOwner): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.NAME(...)
  // - contract.VERSION(...)
  // - contract.approvedHashes(...)
  // - contract.domainSeparator(...)
  // - contract.encodeTransactionData(...)
  // - contract.execTransaction(...)
  // - contract.execTransactionFromModule(...)
  // - contract.execTransactionFromModuleReturnData(...)
  // - contract.getMessageHash(...)
  // - contract.getModules(...)
  // - contract.getModulesPaginated(...)
  // - contract.getOwners(...)
  // - contract.getThreshold(...)
  // - contract.getTransactionHash(...)
  // - contract.isOwner(...)
  // - contract.isValidSignature(...)
  // - contract.nonce(...)
  // - contract.requiredTxGas(...)
  // - contract.signedMessages(...)
}

export function handleApproveHash(event: ApproveHash): void {}

export function handleChangedMasterCopy(event: ChangedMasterCopy): void {}

export function handleChangedThreshold(event: ChangedThreshold): void {}

export function handleDisabledModule(event: DisabledModule): void {}

export function handleEnabledModule(event: EnabledModule): void {}

export function handleExecutionFailure(event: ExecutionFailure): void {}

export function handleExecutionFromModuleFailure(
  event: ExecutionFromModuleFailure
): void {}

export function handleExecutionFromModuleSuccess(
  event: ExecutionFromModuleSuccess
): void {}

export function handleExecutionSuccess(event: ExecutionSuccess): void {}

export function handleRemovedOwner(event: RemovedOwner): void {}

export function handleSignMsg(event: SignMsg): void {}
