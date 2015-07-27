Feature: Proxy
    In Order to be able to connect my legacy Website to a new Service Landscape without touching old code
    As a (UI and Backend)-Developer
    I want to be able to Proxy (for specific paths) to my old website


    Scenario: Proxies a plain web
        Given a legacy website running on Port 3001 always responding with:
        """
        Hello World
        """
        And the pipe is configured to proxy 'http://localhost:3001'
        And the pipe is running
        When I am on '/'
        Then I should see 'Hello World'

    Scenario: The Pipe repsonds chunks as soon as it gets a chunk
        Given a legacy website running on Port 3001 returning a chunk
        """
        Some Text...
        """
        And then the legacy website hang for 3 second
        And then the legacy website responds with
        """
        and some more Text
        """
        Then I should see within 200 milliseconds:
        """
        Some Text...
        """
