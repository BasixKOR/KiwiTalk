use std::error::Error;

use loco_protocol::secure::client::RsaPublicKey;
use num_bigint_dig::BigUint;
use talk_loco_client::{
    client::checkin::{CheckinClient, CheckinReq},
    secure::LocoSecureLayer,
    LocoClient,
};
use tokio::{io::BufStream, net::TcpStream};
use tokio_util::compat::TokioAsyncReadCompatExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let rsa_key = RsaPublicKey::new(
        BigUint::from_bytes_be(&[
            0xAC, 0x58, 0x68, 0x8D, 0x45, 0x97, 0xAA, 0xEE, 0xC6, 0x46, 0x3F, 0x06, 0x58, 0xD2,
            0x20, 0x5F, 0x92, 0x7A, 0xC3, 0x6D, 0xE3, 0x6D, 0x6D, 0xEC, 0xA5, 0x8C, 0xCB, 0xBD,
            0x0A, 0x8B, 0x48, 0xA7, 0x2D, 0xE8, 0x45, 0x43, 0xE9, 0x4B, 0x7D, 0x75, 0xF5, 0xC2,
            0x03, 0xFC, 0x02, 0x13, 0xFF, 0x45, 0x7C, 0xF7, 0x89, 0x04, 0x48, 0x6A, 0xB1, 0x8E,
            0x49, 0xC5, 0x85, 0x04, 0x1D, 0x5B, 0xF3, 0xFB, 0x69, 0xBB, 0xF9, 0xC8, 0xC3, 0x0B,
            0x16, 0xD0, 0x4E, 0x14, 0x86, 0xE7, 0x3D, 0x61, 0x0D, 0x28, 0x20, 0x2F, 0x10, 0x37,
            0xD1, 0x04, 0x41, 0x17, 0x6F, 0xE0, 0x28, 0x3A, 0x3A, 0xBA, 0x6F, 0x4D, 0x83, 0x4A,
            0xB8, 0x40, 0x33, 0xBE, 0xDF, 0xE9, 0xAA, 0x57, 0x0D, 0x5C, 0x56, 0x8C, 0x74, 0x5E,
            0xDF, 0xBE, 0x47, 0x85, 0x1D, 0x35, 0x3D, 0x81, 0x91, 0x51, 0xBE, 0xBE, 0x9D, 0x13,
            0xD9, 0xCE, 0x5E, 0xD5, 0x07, 0x5E, 0x2A, 0xF6, 0x27, 0x1D, 0x82, 0x26, 0x3D, 0xB7,
            0xA8, 0x70, 0x66, 0x3E, 0x48, 0x74, 0x5C, 0x31, 0x67, 0x99, 0x3D, 0xF5, 0x2B, 0x93,
            0x46, 0xCB, 0x6E, 0x7C, 0x3A, 0x3B, 0xF2, 0x83, 0x7A, 0x2E, 0x4B, 0x39, 0x59, 0x38,
            0xDF, 0x92, 0xC4, 0xB0, 0xA1, 0xCD, 0xB6, 0x3E, 0xEE, 0xE1, 0xFB, 0x30, 0x09, 0x57,
            0x6C, 0xE0, 0x81, 0x6D, 0x82, 0x38, 0xC1, 0xAE, 0xDA, 0xEF, 0x86, 0x4E, 0x02, 0x8A,
            0xD3, 0x9C, 0x46, 0xB5, 0x55, 0xC9, 0xEB, 0x8E, 0x0C, 0x8B, 0x97, 0xCB, 0xB8, 0x37,
            0x75, 0xC6, 0xB5, 0x64, 0xB3, 0xCB, 0xC6, 0x16, 0xFA, 0x7D, 0x3D, 0xB9, 0x52, 0xD2,
            0x9D, 0xFB, 0xCF, 0xE3, 0x15, 0x32, 0x0C, 0x87, 0x89, 0xFF, 0xBA, 0x5D, 0xAE, 0xEA,
            0x98, 0xBB, 0x9F, 0x2F, 0x96, 0x94, 0x43, 0xCF, 0x78, 0x1B, 0x21, 0xC3, 0x2E, 0x22,
            0x3D, 0x0E, 0xB7, 0x3D,
        ]),
        BigUint::from(3_u8),
    )
    .unwrap();

    let stream = LocoSecureLayer::new(
        rsa_key,
        BufStream::new(
            TcpStream::connect("ticket-loco.kakao.com:443")
                .await
                .unwrap(),
        )
        .compat(),
    );

    let mut client = CheckinClient::new(LocoClient::new(stream));

    let res = client
        .checkin(&CheckinReq {
            user_id: 1,
            os: "win32",
            net_type: 0,
            app_version: "4.2.0",
            mccmnc: "999",
            language: "ko",
            country_iso: "ko",
            use_sub: true,
        })
        .await;

    println!("CHECKIN response: {:?}\n", res);

    Ok(())
}