import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  GnosisSafe, ExecTransactionCall
} from "../generated/GnosisSafe/GnosisSafe"
import { SafeTransaction, SafeInfo } from "../generated/schema"

export function handleExecTransaction(call: ExecTransactionCall): void {
  let safeId = call.from.toHex()
  let safeInfo = SafeInfo.load(safeId)
  if (safeInfo == null) {
    safeInfo = new SafeInfo(safeId)
    safeInfo.nonce = BigInt.fromI32(0)
    safeInfo.save()
  }
  log.info("Process call from {} in {}", [call.from.toHex(), call.transaction.hash.toHex()])
  let safe = GnosisSafe.bind(call.from)
  let contractNonce = safe.nonce()
  let reverted = contractNonce == safeInfo.nonce
  if (!reverted) {
    safeInfo.nonce = contractNonce
    safeInfo.save()
  }
  let nonce = reverted ? contractNonce : (contractNonce - BigInt.fromI32(1))
  let safeTxHash = safe.getTransactionHash(
    call.inputs.to, 
    call.inputs.value, 
    call.inputs.data, 
    call.inputs.operation, 
    call.inputs.safeTxGas, 
    call.inputs.baseGas, 
    call.inputs.gasPrice, 
    call.inputs.gasToken,
    call.inputs.refundReceiver,
    nonce
  )
  let transaction = new SafeTransaction(safeTxHash.toHex())
  transaction.safe = call.from
  transaction.to = call.inputs.to
  transaction.value = call.inputs.value
  transaction.data = call.inputs.data
  transaction.operation = call.inputs.operation
  transaction.reverted = reverted
  transaction.success = call.outputs.success
  transaction.transaction = call.transaction.hash
  transaction.nonce = nonce
  transaction.save()

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
