import { Client, Wallet, Transaction } from 'xrpl';
import sign, { deriveKeypair } from 'xrpl-sign-keypairs';


// 非同期関数の定義
async function main() {
  const wallet = Wallet.fromSeed('sEd7Pi2eypYE5owiH7vD38FX7ALKZSd');
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  await client.submitAndWait({
    TransactionType: 'SignerListSet',
    Account: wallet.classicAddress,
    SignerEntries: [
      {
        SignerEntry: {
          Account: 'rKjU1h8eKNv53ZnuGhVPX8T4GGBgoUmjj4',
          SignerWeight: 1,
        },
      },
      {
        SignerEntry: {
          Account: 'rUasRGvHhr5AzaGVTdJaUtGU1r8vxQAuRU',
          SignerWeight: 1,
        },
      },
      {
        SignerEntry: {
          Account: 'rn9PWWoUmv3wzdR546eKXE45ceWT6ZXzft',
          SignerWeight: 1,
        },
      },
    ],
    SignerQuorum: 2,
  }, { wallet });

  await client.submitAndWait({
    TransactionType: 'AccountSet',
    Account: wallet.classicAddress,
    SetFlag: 4,
  }, { wallet });

  const account = await client.request({
    account: wallet.classicAddress,
    command: 'account_info',
  });

  const sequence = account.result.account_data.Sequence;

  const txJson: Transaction = {
    TransactionType: 'Payment',
    Destination: 'rQQQrUdN1cLdNmxH4dHfKgmX5P4kf3ZrM',
    Amount: '100',
    Account: wallet.classicAddress,
    Sequence: sequence,
    Fee: '100',
  };

  const signerWalletA = Wallet.fromSeed('sEdVkxWPmae9QDV8yd2aSbyPPQTAwJ6');
  const signedTxByA = sign(JSON.stringify(txJson), deriveKeypair(signerWalletA.seed), {
    signAs: signerWalletA.classicAddress,
  });

  const txJsonByA = JSON.stringify(signedTxByA.txJson);

  const signerWalletB = Wallet.fromSeed('sEdSyyNeCQV9TCA2MLgwUYB3jbFxUAU');
  const signedTxByB = sign(txJsonByA, deriveKeypair(signerWalletB.seed), {
    signAs: signerWalletB.classicAddress,
  });

  const signedTxJson = JSON.stringify(signedTxByB.txJson);

  // ここで signedTxJson を使ってトランザクションを送信する処理を追加
}

// 関数を実行
main();