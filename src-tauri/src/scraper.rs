use reqwest::{Client, ClientBuilder};
use serde::Serialize;
use std::time::Duration;

#[derive(Debug, Serialize)]
pub struct ScraperResponse {
    pub status: u16,
    pub body: String,
}

#[derive(Debug)]
pub struct ScraperError {
    pub message: String,
    pub status: Option<u16>,
}

impl std::fmt::Display for ScraperError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Scraper error: {}", self.message)
    }
}

pub struct Scraper {
    client: Client,
}

impl Scraper {
    pub fn new() -> Self {
        let client = ClientBuilder::new()
            .timeout(Duration::from_secs(30))
            .connect_timeout(Duration::from_secs(10))
            .pool_idle_timeout(Duration::from_secs(90))
            .build()
            .expect("Failed to create HTTP client");

        Self { client }
    }

    pub async fn fetch_html(&self, url: &str, user_agent: &str) -> Result<ScraperResponse, ScraperError> {
        let response = self.client
            .get(url)
            .header("User-Agent", user_agent)
            .send()
            .await
            .map_err(|e| ScraperError {
                message: e.to_string(),
                status: None,
            })?;

        let status = response.status().as_u16();
        let body = response.text().await.map_err(|e| ScraperError {
            message: e.to_string(),
            status: Some(status),
        })?;

        Ok(ScraperResponse { status, body })
    }
}

pub async fn fetch_html(url: &str, user_agent: &str) -> Result<ScraperResponse, String> {
    let scraper = Scraper::new();
    scraper
        .fetch_html(url, user_agent)
        .await
        .map_err(|e| e.message)
}